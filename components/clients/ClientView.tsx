
"use client";
import { useQuery } from "@tanstack/react-query";
import { getClientById } from "@/services/client/clients.api";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Edit, FileText, User } from "lucide-react";
import Button from "@/components/UI/Button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";

// Define your types
interface Lawyer {
  id: string;
  name: string;
  email: string;
}

interface Case {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'ON_HOLD';
  updated_at: string;
  lawyer?: Lawyer;
}

interface Client {
  id: string;
  names: string;
  poc: string;
  phoneNumber: string;
  address: string;
  created_at: string;
  updated_at: string;
  cases?: Case[];
}


export default function ClientViewPage({ params }: { params: { id: string } }) {
const clientId = params.id;
  console.log("Client ID:", clientId);
  const router = useRouter();  
  const { data: client, isLoading, isError, error } = useQuery<Client>({
    queryKey: ['client', clientId],
    queryFn: () => getClientById(clientId),
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Failed to load client');
      if (error?.message === 'Client not found') {
        router.push('/clients');
      }
    }
  }, [isError, error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading client data...</span>
      </div>
    );
  }

   if (!client) {
    return null; 
  }


  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-4">
        <div className="text-red-500 text-center">
          Error loading client: {error.message}
        </div>
        <Button
          onClick={() => router.push("/clients")}
          label="Back to Clients"
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          icon={<ArrowLeft className="h-4 w-4" />}
        />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-4">
        <div className="text-red-500 text-center">Client not found</div>
        <Button
          onClick={() => router.push("/clients")}
          label="Back to Clients"
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          icon={<ArrowLeft className="h-4 w-4" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            {client.names}
          </h1>
          <p className="text-gray-500">Client ID: {client.id}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/clients")}
            label="Back"
            variant="outline"
            icon={<ArrowLeft className="h-4 w-4" />}
          />
          <Link href={`/clients/edit/${client.id}`}>
            <Button
              label="Edit"
              variant="primary"
              icon={<Edit className="h-4 w-4" />}
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Client Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Client Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Point of Contact</p>
              <p className="font-medium">{client.poc}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{client.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{client.address}</p>
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">System Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">{formatDate(client.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(client.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href={`/cases/new?clientId=${client.id}`}>
              <Button
                label="Create New Case"
                variant="outline"
                className="w-full"
                icon={<FileText className="h-4 w-4" />}
              />
            </Link>
            <Button
              label="View Documents"
              variant="outline"
              className="w-full"
              icon={<FileText className="h-4 w-4" />}
            />
            <Button
              label="Send Message"
              variant="outline"
              className="w-full"
              icon={<FileText className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* Cases Section */}
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <FileText className="h-5 w-5 text-blue-500" />
      Associated Cases
    </h2>
    <Link href={`/cases/add${client.id ? `?clientId=${client.id}` : ''}`}>
      <Button
        label="Add Case"
        variant="primary"
        size="sm"
      />
    </Link>
  </div>


        {client.cases && client.cases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lawyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {client.cases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{caseItem.title}</div>
                      <div className="text-sm text-gray-500">#{caseItem.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        caseItem.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                        caseItem.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {caseItem.lawyer ? (
                        <div>
                          <div className="font-medium">{caseItem.lawyer.name}</div>
                          <div className="text-sm text-gray-500">{caseItem.lawyer.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(caseItem.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/cases/view/${caseItem.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cases</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new case.</p>
            <div className="mt-6">
              <Link href={`/cases/new?clientId=${client.id}`}>
                <Button
                  label="New Case"
                  variant="primary"
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}