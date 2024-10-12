"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { addExpense, getExpenses, deleteExpense, Expense } from '@/lib/db';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadExpenses();
  }, []);

  const categoryMap = {
    office: 'කාර්යාල',
    travel: 'ප්‍රවාහන',
    meals: 'ආහාර',
    utilities: 'බිල්පත්',
    other: 'වෙනත්',
  };

  async function loadExpenses() {
    const loadedExpenses = await getExpenses();
    setExpenses(loadedExpenses);
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addExpense(newExpense);
      toast({
        title: "වැය වියදම ඇතුලත් කෙරිණි.",
        description: "සාර්ථකව ඇතුලත් කරන ලදි",
      });
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        category: '',
      });
      loadExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteExpense(id: number) {
    try {
      await deleteExpense(id);
      toast({
        title: "වැය වියදම ඉවත් කෙරිණි.",
        description: "සාර්ථකව ඉවත් කරන ලදි",
      });
      loadExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">දෛනික අය වැය</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>වැය විස්තර</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">දිනය</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">මුදල</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">විස්තර</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">වර්ගය</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="වර්ගය තෝරන්න" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">කාර්යාල</SelectItem>
                  <SelectItem value="travel">ප්‍රවාහන</SelectItem>
                  <SelectItem value="meals">ආහාර</SelectItem>
                  <SelectItem value="utilities">බිල්පත්</SelectItem>
                  <SelectItem value="other">වෙනත්</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">ඇතුලත් කරන්න</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>වියදම් වාර්තාව</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>දිනය</TableHead>
                <TableHead>විස්තරය</TableHead>
                <TableHead>වර්ගය</TableHead>
                <TableHead className="text-right">මුදල</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{categoryMap[expense.category as keyof typeof categoryMap]}</TableCell>
                  <TableCell className="text-right">රු.{expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => expense.id && handleDeleteExpense(expense.id)}
                    >
                      මකා දමන්න
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}