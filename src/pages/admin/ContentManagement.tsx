
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell
} from '@/components/ui/table';
import { 
  Card, CardHeader, CardContent, CardTitle, 
  CardDescription, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const ContentManagement = () => {
  const [frequencies, setFrequencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    hz: '',
    description: '',
    purpose: '',
    category: '',
    is_premium: false
  });
  
  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('title', { ascending: true });
      
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
      
      // Load frequencies
      const { data: frequenciesData, error: frequenciesError } = await supabase
        .from('frequencies')
        .select('*')
        .order('name', { ascending: true });
      
      if (frequenciesError) throw frequenciesError;
      setFrequencies(frequenciesData || []);
    } catch (error) {
      console.error('Error loading content data:', error);
      toast({
        title: "Erro ao carregar conteúdo",
        description: "Ocorreu um problema ao buscar os dados de conteúdo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_premium: checked }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      hz: '',
      description: '',
      purpose: '',
      category: '',
      is_premium: false
    });
  };
  
  const openEditDialog = (frequency: any) => {
    setCurrentFrequency(frequency);
    setFormData({
      name: frequency.name || '',
      hz: frequency.hz ? String(frequency.hz) : '',
      description: frequency.description || '',
      purpose: frequency.purpose || '',
      category: frequency.category || '',
      is_premium: Boolean(frequency.is_premium)
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (frequency: any) => {
    setCurrentFrequency(frequency);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddFrequency = async () => {
    try {
      const { data, error } = await supabase
        .from('frequencies')
        .insert({
          name: formData.name,
          hz: parseFloat(formData.hz),
          description: formData.description,
          purpose: formData.purpose,
          category: formData.category,
          is_premium: formData.is_premium
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Frequência adicionada",
        description: "A nova frequência foi adicionada com sucesso.",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error adding frequency:', error);
      toast({
        title: "Erro ao adicionar frequência",
        description: "Ocorreu um problema ao salvar a nova frequência.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateFrequency = async () => {
    if (!currentFrequency) return;
    
    try {
      const { error } = await supabase
        .from('frequencies')
        .update({
          name: formData.name,
          hz: parseFloat(formData.hz),
          description: formData.description,
          purpose: formData.purpose,
          category: formData.category,
          is_premium: formData.is_premium
        })
        .eq('id', currentFrequency.id);
      
      if (error) throw error;
      
      toast({
        title: "Frequência atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error updating frequency:', error);
      toast({
        title: "Erro ao atualizar frequência",
        description: "Ocorreu um problema ao salvar as alterações.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteFrequency = async () => {
    if (!currentFrequency) return;
    
    try {
      const { error } = await supabase
        .from('frequencies')
        .delete()
        .eq('id', currentFrequency.id);
      
      if (error) throw error;
      
      toast({
        title: "Frequência removida",
        description: "A frequência foi removida com sucesso.",
      });
      
      setIsDeleteDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error deleting frequency:', error);
      toast({
        title: "Erro ao remover frequência",
        description: "Ocorreu um problema ao remover a frequência.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Conteúdo</h1>
          <p className="text-muted-foreground">Gerencie as frequências e categorias</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Frequência
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequências</CardTitle>
          <CardDescription>Todas as frequências disponíveis no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Hz</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {frequencies.length > 0 ? (
                    frequencies.map((frequency) => (
                      <TableRow key={frequency.id}>
                        <TableCell className="font-medium">{frequency.name}</TableCell>
                        <TableCell>{frequency.hz} Hz</TableCell>
                        <TableCell>{frequency.category}</TableCell>
                        <TableCell>
                          {frequency.is_premium ? (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                              Premium
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                              Gratuito
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => openEditDialog(frequency)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-red-500 hover:text-red-500"
                              onClick={() => openDeleteDialog(frequency)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma frequência encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Frequency Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Frequência</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova frequência para adicionar ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Nome da frequência"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hz">Frequência (Hz)</Label>
                <Input 
                  id="hz" 
                  name="hz" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hz}
                  onChange={handleFormChange}
                  placeholder="Ex.: 432"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select name="category" value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.type}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Propósito</Label>
              <Textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleFormChange}
                placeholder="Propósito desta frequência"
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Descrição detalhada da frequência"
                className="resize-none"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_premium">Frequência Premium</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddFrequency}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Frequency Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Frequência</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da frequência.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Nome da frequência"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hz">Frequência (Hz)</Label>
                <Input 
                  id="edit-hz" 
                  name="hz" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hz}
                  onChange={handleFormChange}
                  placeholder="Ex.: 432"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria</Label>
              <Select name="category" value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.type}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-purpose">Propósito</Label>
              <Textarea
                id="edit-purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleFormChange}
                placeholder="Propósito desta frequência"
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Descrição detalhada da frequência"
                className="resize-none"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-is_premium"
                checked={formData.is_premium}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-is_premium">Frequência Premium</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateFrequency}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir a frequência "{currentFrequency?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteFrequency}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
