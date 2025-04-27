import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Plus, Filter, FileDown, Eye, BookOpen, FileText, Video, File, Download, Share2, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  
  // Get subjects for filter
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects'],
  });
  
  // Get resources, filtered if necessary
  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/resources', { type: typeFilter, subject: subjectFilter, search: searchTerm }],
  });
  
  const filteredResources = resources ?? [];
  
  function getResourceIcon(type: string) {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'image':
        return <Eye className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  }
  
  function getResourceTypeBadge(type: string) {
    switch (type) {
      case 'document':
        return <Badge className="bg-blue-100 text-blue-800">Document</Badge>;
      case 'video':
        return <Badge className="bg-red-100 text-red-800">Video</Badge>;
      case 'image':
        return <Badge className="bg-green-100 text-green-800">Image</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
    }
  }
  
  return (
    <DashboardLayout title="Resources & Materials">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search resources..."
            type="search"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects?.map((subject: any) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          {(isAdmin || isTeacher) && (
            <Button className="md:ml-2">
              <Plus className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-full text-center py-8">
                    Loading resources...
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    No resources found.
                  </div>
                ) : (
                  filteredResources.map((resource: any) => (
                    <Card key={resource.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            <CardTitle className="text-base">{resource.name}</CardTitle>
                          </div>
                          {getResourceTypeBadge(resource.type)}
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {resource.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{resource.subject?.name || 'General'}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {resource.createdAt ? format(new Date(resource.createdAt), 'MMM d, yyyy') : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
              
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources
                    .filter((r: any) => r.type === 'document')
                    .map((resource: any) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            {resource.name}
                          </div>
                        </TableCell>
                        <TableCell>{resource.subject?.name || 'General'}</TableCell>
                        <TableCell>{resource.uploadedByUser?.firstName || 'Unknown'}</TableCell>
                        <TableCell>
                          {resource.createdAt ? format(new Date(resource.createdAt), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources
                  .filter((r: any) => r.type === 'video')
                  .map((resource: any) => (
                    <Card key={resource.id}>
                      <div className="aspect-video bg-gray-100 relative rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{resource.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {resource.description || 'No description available'}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Watch Video
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredResources
                  .filter((r: any) => r.type === 'image')
                  .map((resource: any) => (
                    <Card key={resource.id} className="overflow-hidden">
                      <div className="aspect-square bg-gray-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Eye className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-1">{resource.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {resource.subject?.name || 'General'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Recently Added Resources */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Recently Added</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">Physics Notes Chapter 5</CardTitle>
                </div>
                <Badge className="bg-blue-100 text-blue-800">New</Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-gray-500">
                Comprehensive notes on wave mechanics and interference patterns.
              </p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-base">Data Structures Tutorial</CardTitle>
                </div>
                <Badge className="bg-blue-100 text-blue-800">New</Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-gray-500">
                Video tutorial covering linked lists, stacks, and queues.
              </p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Watch
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-base">Chemistry Reference Guide</CardTitle>
                </div>
                <Badge className="bg-blue-100 text-blue-800">New</Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-gray-500">
                Essential formulae and equations for Organic Chemistry.
              </p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
