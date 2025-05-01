
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Edit, Save, X, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  active: boolean;
  kiwify_url?: string;
}

export function SubscriptionPlanManager() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  
  // Form state for new or edited plan
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: '',
    description: '',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    active: true,
    kiwify_url: ''
  });
  
  // Load plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);
  
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');
        
      if (error) {
        throw error;
      }
      
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      toast.error('Erro ao carregar planos', {
        description: 'Não foi possível carregar os planos de assinatura.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'BRL',
      interval: 'month',
      active: true,
      kiwify_url: ''
    });
    setIsCreating(false);
    setEditingPlan(null);
  };
  
  const handleCreatePlan = async () => {
    try {
      if (!formData.name || formData.price === undefined || formData.price < 0) {
        toast.error('Dados inválidos', {
          description: 'Por favor, preencha todos os campos obrigatórios.'
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([{
          name: formData.name,
          description: formData.description,
          price: formData.price,
          currency: formData.currency || 'BRL',
          interval: formData.interval || 'month',
          active: formData.active !== undefined ? formData.active : true,
          kiwify_url: formData.kiwify_url
        }])
        .select();
        
      if (error) throw error;
      
      toast.success('Plano criado', {
        description: 'O plano de assinatura foi criado com sucesso.'
      });
      
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Erro ao criar plano', {
        description: 'Não foi possível criar o plano de assinatura.'
      });
    }
  };
  
  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    
    try {
      if (!formData.name || formData.price === undefined || formData.price < 0) {
        toast.error('Dados inválidos', {
          description: 'Por favor, preencha todos os campos obrigatórios.'
        });
        return;
      }
      
      const { error } = await supabase
        .from('subscription_plans')
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          currency: formData.currency,
          interval: formData.interval,
          active: formData.active,
          kiwify_url: formData.kiwify_url
        })
        .eq('id', editingPlan.id);
        
      if (error) throw error;
      
      toast.success('Plano atualizado', {
        description: 'O plano de assinatura foi atualizado com sucesso.'
      });
      
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Erro ao atualizar plano', {
        description: 'Não foi possível atualizar o plano de assinatura.'
      });
    }
  };
  
  const handleDeletePlan = async (plan: SubscriptionPlan) => {
    if (!confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', plan.id);
        
      if (error) throw error;
      
      toast.success('Plano excluído', {
        description: 'O plano de assinatura foi excluído com sucesso.'
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Erro ao excluir plano', {
        description: 'Não foi possível excluir o plano de assinatura.'
      });
    }
  };
  
  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      active: plan.active,
      kiwify_url: plan.kiwify_url || ''
    });
    setIsCreating(false);
  };
  
  const toggleActive = async (plan: SubscriptionPlan) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update({ active: !plan.active })
        .eq('id', plan.id);
        
      if (error) throw error;
      
      toast.success(plan.active ? 'Plano desativado' : 'Plano ativado', {
        description: `O plano foi ${plan.active ? 'desativado' : 'ativado'} com sucesso.`
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Error toggling plan active state:', error);
      toast.error('Erro ao alterar status do plano', {
        description: 'Não foi possível alterar o status do plano.'
      });
    }
  };
  
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Planos de Assinatura</CardTitle>
            <CardDescription>
              Gerencie os planos de assinatura disponíveis para seus usuários
            </CardDescription>
          </div>
          {!isCreating && !editingPlan && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isCreating || editingPlan ? (
            <div className="space-y-4 border p-4 rounded-md">
              <h3 className="text-lg font-medium">
                {isCreating ? 'Criar Novo Plano' : 'Editar Plano'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Plano</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="ex: Plano Mensal"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleNumberChange}
                    placeholder="ex: 19.90"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interval">Intervalo</Label>
                  <Select 
                    value={formData.interval} 
                    onValueChange={(value) => handleSelectChange('interval', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um intervalo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mensal</SelectItem>
                      <SelectItem value="year">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="kiwify_url">URL de checkout Kiwify</Label>
                  <Input
                    id="kiwify_url"
                    name="kiwify_url"
                    value={formData.kiwify_url}
                    onChange={handleInputChange}
                    placeholder="ex: https://kiwify.checkout.com/..."
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Descrição do plano..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleSwitchChange('active', checked)}
                  />
                  <Label htmlFor="active">Ativo</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                
                <Button 
                  onClick={isCreating ? handleCreatePlan : handleUpdatePlan}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isCreating ? 'Criar Plano' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : plans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Intervalo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL Kiwify</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatPrice(plan.price, plan.currency)}</TableCell>
                    <TableCell>
                      {plan.interval === 'month' ? 'Mensal' : 'Anual'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        plan.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {plan.kiwify_url ? (
                        <span className="text-xs truncate max-w-[150px] inline-block">
                          {plan.kiwify_url}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não definida</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => toggleActive(plan)}
                          title={plan.active ? 'Desativar' : 'Ativar'}
                        >
                          <Switch checked={plan.active} className="pointer-events-none" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => startEdit(plan)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDeletePlan(plan)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50/50"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum plano de assinatura encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
