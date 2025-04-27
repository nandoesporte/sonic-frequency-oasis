
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell
} from '@/components/ui/table';
import { 
  Card, CardHeader, CardContent, CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const PAGE_SIZE = 10;
  
  const loadUsers = async (pageNumber = 1, search = '') => {
    setLoading(true);
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          id,
          username,
          full_name,
          created_at,
          updated_at,
          subscribers!left(subscribed, subscription_end)
        `);
      
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%`);
      }
      
      const startIndex = (pageNumber - 1) * PAGE_SIZE;
      // Fix for the count argument - use object syntax instead
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + PAGE_SIZE - 1)
        .select('*', { count: 'exact' });
      
      if (error) throw error;
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / PAGE_SIZE));
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Ocorreu um problema ao buscar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUsers(page, searchTerm);
  }, [page]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    loadUsers(1, searchTerm);
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Lista de todos os usuários cadastrados</CardDescription>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar usuários..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Buscar</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de cadastro</TableHead>
                      <TableHead>Última atualização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                          <TableCell>{user.username || 'N/A'}</TableCell>
                          <TableCell>
                            {user.subscribers && user.subscribers[0]?.subscribed ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Premium
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                Free
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            {new Date(user.updated_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={handlePreviousPage}
                          className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4">
                          Página {page} de {totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext 
                          onClick={handleNextPage}
                          className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
