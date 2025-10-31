import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { databaseService } from '../services/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, UserX, Shield, AlertTriangle, Search, Filter } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function UserManagement() {
  const { user, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await databaseService.getAllUsers();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError('Erro ao carregar lista de usuários: ' + result.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar lista de usuários');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId, newRole) => {
    try {
      setError('');
      setSuccess('');

      console.log('Aprovando usuário:', userId, 'com role:', newRole);

      const result = await databaseService.updateUser(userId, {
        role: newRole,
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: user?.uid
      });

      console.log('Resultado da aprovação:', result);

      if (result.success) {
        setSuccess(`Usuário aprovado com sucesso como ${newRole}`);
        await loadUsers();
      } else {
        setError('Erro ao aprovar usuário: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      setError('Erro ao aprovar usuário');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      setError('');
      setSuccess('');

      const result = await databaseService.updateUser(userId, {
        role: 'rejected',
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: user?.uid
      });

      if (result.success) {
        setSuccess('Usuário rejeitado com sucesso');
        await loadUsers();
      } else {
        setError('Erro ao rejeitar usuário: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error);
      setError('Erro ao rejeitar usuário');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' ||
      (filter === 'pending' && user.role === 'pending') ||
      (filter === 'approved' && ['consultora', 'gerente', 'admin'].includes(user.role)) ||
      (filter === 'rejected' && user.role === 'rejected');

    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const variants = {
      pending: 'secondary',
      consultora: 'default',
      gerente: 'outline',
      admin: 'destructive',
      rejected: 'destructive'
    };

    const labels = {
      pending: 'Pendente',
      consultora: 'Consultora',
      gerente: 'Gerente',
      admin: 'Administrador',
      rejected: 'Rejeitado'
    };

    return <Badge variant={variants[role] || 'secondary'}>{labels[role] || role}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#823a80]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#823a80]" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600 mt-1">
            Aprove ou rejeite solicitações de acesso ao sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Users className="w-4 h-4 mr-1" />
            {users.length} usuários
          </Badge>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <UserCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar usuário</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="filter">Filtrar por status</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie o acesso de todos os usuários cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum usuário encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.role === 'pending' && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Aprovar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Aprovar Usuário</DialogTitle>
                                  <DialogDescription>
                                    Selecione o cargo para {user.displayName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="role">Cargo</Label>
                                    <Select onValueChange={(value) => setSelectedUser({...user, newRole: value})}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o cargo" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="consultora">Consultora</SelectItem>
                                        <SelectItem value="gerente">Gerente</SelectItem>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => handleApproveUser(user.uid, selectedUser?.newRole)}
                                    disabled={!selectedUser?.newRole}
                                  >
                                    Aprovar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectUser(user.uid)}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        {user.role !== 'pending' && (
                          <span className="text-sm text-gray-500">
                            {user.role === 'rejected' ? 'Rejeitado' : 'Aprovado'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
