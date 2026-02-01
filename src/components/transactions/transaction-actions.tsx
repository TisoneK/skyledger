'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Share,
  Copy,
  Check,
  X,
  AlertTriangle,
  FileText,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import { getRoleCardClasses } from '@/lib/role-colors';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  categoryName: string;
  date: string;
  roleId: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionActionsProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onView?: (transaction: Transaction) => void;
  onDuplicate?: (transaction: Transaction) => void;
  onExport?: (transaction: Transaction) => void;
  onShare?: (transaction: Transaction) => void;
}

export function TransactionActions({ 
  transaction, 
  onEdit, 
  onDelete, 
  onView,
  onDuplicate,
  onExport,
  onShare
}: TransactionActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const roleConfig = getRoleCardClasses(transaction.roleId as any);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(transaction.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const transactionText = `
Transaction Details:
-----------------
Description: ${transaction.description}
Amount: ${transaction.type === 'INCOME' ? '+' : '-'}${formatCurrency(transaction.amount)}
Type: ${transaction.type}
Category: ${transaction.categoryName}
Date: ${formatDate(transaction.date)}
Role: ${transaction.roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
${transaction.note ? `Note: ${transaction.note}` : ''}
    `.trim();

    try {
      await navigator.clipboard.writeText(transactionText);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && onShare) {
      try {
        await onShare(transaction);
      } catch (error) {
        console.error('Failed to share transaction:', error);
      }
    } else {
      // Fallback to copying to clipboard
      handleCopyToClipboard();
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {onView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(transaction)}
            className="h-8 w-8 p-0"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
            className="h-8 w-8 p-0"
            title="Edit Transaction"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        
        {onDuplicate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(transaction)}
            className="h-8 w-8 p-0"
            title="Duplicate Transaction"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
        
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport(transaction)}
            className="h-8 w-8 p-0"
            title="Export Transaction"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        
        {(onShare || navigator.share) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 w-8 p-0"
            title="Share Transaction"
          >
            <Share className="h-4 w-4" />
          </Button>
        )}
        
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            title="Delete Transaction"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Delete Transaction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete this transaction? This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{transaction.description}</span>
                  <Badge variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}>
                    {transaction.type}
                  </Badge>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(transaction.date)}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${roleConfig}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Transaction Details</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <div className="text-lg font-semibold">{transaction.description}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <div className={`text-2xl font-bold ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <div>
                      <Badge variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}>
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{transaction.categoryName}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <div className="capitalize">
                      {transaction.roleId.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              {transaction.note && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Note</label>
                  <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                    {transaction.note}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">System Information</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    {formatDate(transaction.createdAt)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated: </span>
                    {formatDate(transaction.updatedAt)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transaction ID: </span>
                    <code className="bg-muted px-1 rounded">{transaction.id}</code>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCopyToClipboard}
                  className="flex items-center space-x-2"
                >
                  {copiedToClipboard ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Details</span>
                    </>
                  )}
                </Button>
                
                {onEdit && (
                  <Button
                    onClick={() => {
                      onEdit(transaction);
                      setShowDetails(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Transaction Action Menu Component
interface TransactionActionMenuProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onView?: (transaction: Transaction) => void;
  onDuplicate?: (transaction: Transaction) => void;
  onExport?: (transaction: Transaction) => void;
  onShare?: (transaction: Transaction) => void;
}

export function TransactionActionMenu({
  transaction,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onExport,
  onShare
}: TransactionActionMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="h-8 w-8 p-0"
      >
        <FileText className="h-4 w-4" />
      </Button>
      
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-lg shadow-lg z-50">
          <div className="p-1">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onView(transaction);
                  setShowMenu(false);
                }}
                className="w-full justify-start"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onEdit(transaction);
                  setShowMenu(false);
                }}
                className="w-full justify-start"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDuplicate(transaction);
                  setShowMenu(false);
                }}
                className="w-full justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            )}
            
            {onExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onExport(transaction);
                  setShowMenu(false);
                }}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            
            {(onShare || navigator.share) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onShare?.(transaction);
                  setShowMenu(false);
                }}
                className="w-full justify-start"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDelete(transaction.id);
                  setShowMenu(false);
                }}
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
