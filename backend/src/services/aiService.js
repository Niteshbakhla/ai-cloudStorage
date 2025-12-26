import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
// import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import File from "../models/fileSchema.js"
import config from "../config/config.js";



class AIService {
            constructor() {
                        this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
                        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                        this.processingQueue = [];
                        this.isProcessing = false;
            }

            // Extract text from different file types
            async extractTextFromFile(filePath, mimetype) {
                        try {
                                    if (mimetype.includes('text/plain')) {
                                                return fs.readFileSync(filePath, 'utf8');
                                    }
                                    else if (mimetype.includes('application/pdf')) {
                                                const dataBuffer = fs.readFileSync(filePath);
                                                const pdfData = await pdfParse(dataBuffer);
                                                return pdfData.text;
                                    }
                                    else if (mimetype.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                                                const result = await mammoth.extractRawText({ path: filePath });
                                                return result.value;
                                    }
                                    return null;
                        } catch (error) {
                                    console.error('Text extraction error:', error);
                                    return null;
                        }
            }

            // Analyze file with AI
            async analyzeFile(filePath, mimetype, originalName) {
                        try {
                                    let prompt = '';
                                    let parts = [];

                                    if (mimetype.includes('image/')) {
                                                // For images
                                                const imageData = fs.readFileSync(filePath);
                                                const base64Image = imageData.toString('base64');

                                                parts = [
                                                            {
                                                                        inlineData: {
                                                                                    mimeType: mimetype,
                                                                                    data: base64Image
                                                                        }
                                                            },
                                                            {
                                                                        text: `Analyze this image and provide a brief summary as short as possible  (1 sentences) of what it contains. Also suggest 3 relevant tags and categorize it (photo, document, screenshot, diagram, etc.). 
          
          Format your response as:
          Summary: [brief description]
          Tags: [tag1, tag2, tag3]
          Category: [category]`
                                                            }
                                                ];
                                    } else {
                                                // For text-based files
                                                const extractedText = await this.extractTextFromFile(filePath, mimetype);

                                                if (!extractedText) {
                                                            return {
                                                                        summary: `${originalName} - File type not fully supported for content analysis`,
                                                                        tags: ['document'],
                                                                        category: 'document'
                                                            };
                                                }

                                                // Limit text to avoid token limits
                                                const textToAnalyze = extractedText.substring(0, 3000);

                                                prompt = `Analyze this document and provide:
          1. A brief summary (1-2 sentences) of the main content
          2. 3 relevant tags
          3. Document category (contract, report, invoice, letter, resume, etc.)
          
          Document content:
          ${textToAnalyze}
          
          Format your response as:
          Summary: [brief description]
          Tags: [tag1, tag2, tag3]
          Category: [category]`;

                                                parts = [{ text: prompt }];
                                    }

                                    const result = await this.model.generateContent(parts);
                                    const response = await result.response;
                                    const text = response.text();

                                    // Parse the response
                                    const summary = this.extractField(text, 'Summary');
                                    const tags = this.extractField(text, 'Tags').split(',').map(t => t.trim());
                                    const category = this.extractField(text, 'Category');

                                    return {
                                                summary: summary || `${originalName} - Content analyzed`,
                                                tags: tags.filter(t => t.length > 0).slice(0, 3),
                                                category: category || 'document'
                                    };

                        } catch (error) {
                                    console.error('AI analysis error:', error);
                                    return {
                                                summary: `${originalName} - Analysis failed`,
                                                tags: ['document'],
                                                category: 'document'
                                    };
                        }
            }

            // Helper to extract fields from AI response
            extractField(text, fieldName) {
                        const regex = new RegExp(`${fieldName}:\\s*(.+?)(?=\\n|$)`, 'i');
                        // const regex = new RegExp(`${fieldName}:\\s*(.+?)(?=\\n[A-Z]|\\n\\n|$)`, 'i');
                        const match = text.match(regex);
                        return match ? match[1].trim() : '';
            }

            // Add file to processing queue
            async queueFileForProcessing(fileId) {
                        if (this.processingQueue.includes(fileId)) return;
                        this.processingQueue.push(fileId);

                        // Update status
                        await File.findByIdAndUpdate(fileId, {
                                    aiProcessingStatus: 'pending'
                        });

                        // Start processing if not already running
                        if (!this.isProcessing) {
                                    this.processQueue();
                        }
            }

            // Process queue with delay for rate limiting
            async processQueue() {
                        if (this.processingQueue.length === 0) {
                                    this.isProcessing = false;
                                    return;
                        }

                        this.isProcessing = true;
                        const fileId = this.processingQueue.shift();

                        try {
                                    const file = await File.findById(fileId);
                                    if (!file) {
                                                console.log(`File ${fileId} not found`);
                                                setTimeout(() => this.processQueue(), 5000);
                                                return;
                                    }

                                    // Update status to processing
                                    await File.findByIdAndUpdate(fileId, {
                                                aiProcessingStatus: 'processing'
                                    });

                                    console.log(`Processing file: ${file.originalName}`);

                                    // Analyze the file
                                    const analysis = await this.analyzeFile(file.filePath, file.fileType, file.originalName);

                                    // Save results
                                    await File.findByIdAndUpdate(fileId, {
                                                aiSummary: analysis.summary,
                                                aiTags: analysis.tags,
                                                aiCategory: analysis.category,
                                                aiProcessed: true,
                                                aiProcessingStatus: 'completed'
                                    });

                                    console.log(`✅ Completed analysis for: ${file.originalName}`);

                        } catch (error) {
                                    console.error(`❌ Error processing file ${fileId}:`, error);

                                    await File.findByIdAndUpdate(fileId, {
                                                aiProcessingStatus: 'failed'
                                    });
                        }

                        // Wait 65 seconds before next request (rate limit: 1 per minute)
                        setTimeout(() => this.processQueue(), 65000);
            }

            // Get queue status
            getQueueStatus() {
                        return {
                                    queueLength: this.processingQueue.length,
                                    isProcessing: this.isProcessing
                        };
            }
}

export default new AIService();