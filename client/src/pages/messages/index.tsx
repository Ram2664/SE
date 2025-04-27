import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MessagesPage() {
  return (
    <DashboardLayout title="Messages">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            Message functionality will be implemented soon...
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}