import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shield, User, MoreHorizontal, Trash2, UserCog } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

interface TeamTableProps {
  members: TeamMember[];
  onChangeRole: (userId: string, newRole: 'admin' | 'user') => void;
  onDelete: (member: TeamMember) => void;
}

export function TeamTable({ members, onChangeRole, onDelete }: TeamTableProps) {
  const { user } = useAuth();

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">Nome</TableHead>
            <TableHead className="text-muted-foreground font-medium">Email</TableHead>
            <TableHead className="text-muted-foreground font-medium">Papel</TableHead>
            <TableHead className="text-muted-foreground font-medium">Cadastrado em</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isCurrentUser = member.userId === user?.id;
            
            return (
              <TableRow key={member.id} className="border-border">
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {member.name}
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs">Você</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.role === 'admin' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {member.role === 'admin' ? (
                      <>
                        <Shield className="h-3 w-3" />
                        Administrador
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" />
                        Funcionário
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(member.createdAt, "dd 'de' MMM, yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isCurrentUser}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onChangeRole(
                          member.userId,
                          member.role === 'admin' ? 'user' : 'admin'
                        )}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        {member.role === 'admin' ? 'Tornar Funcionário' : 'Tornar Administrador'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(member)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhum membro na equipe ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
