import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { summarizeText, answerQuestion, generateQuizQuestions } from '@/lib/openai';
import { BrainCircuit, Sparkles, FileText, PenLine, BookOpen, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// Define form schemas
const askQuestionSchema = z.object({
  question: z.string().min(5, { message: 'Question must be at least 5 characters' }),
  context: z.string().optional(),
});

const summarizeSchema = z.object({
  text: z.string().min(50, { message: 'Text must be at least 50 characters' }),
});

const quizSchema = z.object({
  subject: z.string().min(1, { message: 'Subject is required' }),
  topic: z.string().min(1, { message: 'Topic is required' }),
  count: z.number().int().min(1).max(10)
});

type AskQuestionFormData = z.infer<typeof askQuestionSchema>;
type SummarizeFormData = z.infer<typeof summarizeSchema>;
type QuizFormData = z.infer<typeof quizSchema>;

export default function AITutorPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('ask');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for responses
  const [answer, setAnswer] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[] | null>(null);
  
  // Form for asking questions
  const askForm = useForm<AskQuestionFormData>({
    resolver: zodResolver(askQuestionSchema),
    defaultValues: {
      question: '',
      context: '',
    }
  });
  
  // Form for summarizing text
  const summarizeForm = useForm<SummarizeFormData>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: {
      text: '',
    }
  });
  
  // Form for generating quiz questions
  const quizForm = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      subject: '',
      topic: '',
      count: 5,
    }
  });
  
  const handleAskQuestion = async (data: AskQuestionFormData) => {
    try {
      setIsProcessing(true);
      setAnswer(null);
      
      const response = await answerQuestion(data.question, data.context || undefined);
      setAnswer(response);
      
      toast({
        title: "Question answered",
        description: "Your question has been processed successfully."
      });
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: "Error",
        description: "Failed to process your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSummarize = async (data: SummarizeFormData) => {
    try {
      setIsProcessing(true);
      setSummary(null);
      
      const response = await summarizeText(data.text);
      setSummary(response);
      
      toast({
        title: "Text summarized",
        description: "Your text has been summarized successfully."
      });
    } catch (error) {
      console.error('Error summarizing text:', error);
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGenerateQuiz = async (data: QuizFormData) => {
    try {
      setIsProcessing(true);
      setQuizQuestions(null);
      
      const response = await generateQuizQuestions(data.subject, data.topic, data.count);
      setQuizQuestions(response.questions);
      
      toast({
        title: "Quiz generated",
        description: `${data.count} quiz questions have been generated successfully.`
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to generate quiz questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <DashboardLayout title="AI Tutor" subtitle="Get AI-powered assistance with your studies">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
                AI Learning Assistant
              </CardTitle>
              <CardDescription>
                Get help with your studies using AI-powered tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="ask">Ask</TabsTrigger>
                  <TabsTrigger value="summarize">Summarize</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ask" className="pt-4">
                  <Form {...askForm}>
                    <form onSubmit={askForm.handleSubmit(handleAskQuestion)} className="space-y-4">
                      <FormField
                        control={askForm.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Question</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. What is the law of conservation of energy?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={askForm.control}
                        name="context"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Context (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add any specific context or details related to your question..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Adding context helps the AI give more accurate answers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" /> Get Answer
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="summarize" className="pt-4">
                  <Form {...summarizeForm}>
                    <form onSubmit={summarizeForm.handleSubmit(handleSummarize)} className="space-y-4">
                      <FormField
                        control={summarizeForm.control}
                        name="text"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text to Summarize</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Paste your text here to get a concise summary..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" /> Summarize
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="quiz" className="pt-4">
                  <Form {...quizForm}>
                    <form onSubmit={quizForm.handleSubmit(handleGenerateQuiz)} className="space-y-4">
                      <FormField
                        control={quizForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Geography">Geography</SelectItem>
                                <SelectItem value="Literature">Literature</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={quizForm.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. Trigonometry, Quantum Physics, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={quizForm.control}
                        name="count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Questions</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Number of questions" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3">3 Questions</SelectItem>
                                <SelectItem value="5">5 Questions</SelectItem>
                                <SelectItem value="10">10 Questions</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" /> Generate Quiz
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* AI Tips Card */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                AI Tutor Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Ask specific questions to get more precise answers</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Provide context to improve the quality of responses</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Use the summarize feature to simplify complex content</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Generate quizzes to test your understanding of topics</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Always verify important information with your textbooks</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Results Area */}
        <div className="lg:col-span-2">
          {activeTab === 'ask' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenLine className="h-5 w-5 mr-2 text-primary" />
                  Answer
                </CardTitle>
                <CardDescription>
                  AI-generated response to your question
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4 text-sm text-gray-500">Thinking...</p>
                    </div>
                  </div>
                ) : answer ? (
                  <div className="prose prose-sm max-w-none">
                    <p>{answer}</p>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-center">
                    <div>
                      <Sparkles className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Ask a question</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your answer will appear here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'summarize' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Summary
                </CardTitle>
                <CardDescription>
                  AI-generated summary of your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4 text-sm text-gray-500">Summarizing...</p>
                    </div>
                  </div>
                ) : summary ? (
                  <div className="prose prose-sm max-w-none">
                    <p>{summary}</p>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-center">
                    <div>
                      <FileText className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Summarize text</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your summary will appear here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'quiz' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Generated Quiz
                </CardTitle>
                <CardDescription>
                  Test your knowledge with these AI-generated questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4 text-sm text-gray-500">Generating quiz questions...</p>
                    </div>
                  </div>
                ) : quizQuestions && quizQuestions.length > 0 ? (
                  <div className="space-y-6">
                    {quizQuestions.map((q, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-medium text-base mb-3">
                          {index + 1}. {q.question}
                        </h3>
                        <div className="space-y-2">
                          {q.options.map((option: string, optIndex: number) => (
                            <div key={optIndex} className="flex items-center">
                              <input 
                                type="radio" 
                                id={`q${index}-opt${optIndex}`} 
                                name={`question-${index}`}
                                className="mr-2"
                              />
                              <label 
                                htmlFor={`q${index}-opt${optIndex}`}
                                className={`text-sm ${option === q.correctAnswer ? 'font-medium' : ''}`}
                              >
                                {option}
                              </label>
                              {option === q.correctAnswer && (
                                <span className="ml-2 text-xs text-green-600">(Correct)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-center">
                    <div>
                      <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Generate a quiz</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your quiz questions will appear here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              {quizQuestions && quizQuestions.length > 0 && (
                <CardFooter>
                  <Button className="w-full">
                    Save Quiz for Later
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}