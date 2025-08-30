"use client";

import { useState, useEffect, useMemo } from "react";
import { authClient } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Eye,
  Shield,
  ShieldOff,
  Ban,
  UnlockKeyhole,
  Search,
  RefreshCw,
  Crown,
  User,
  Calendar,
  ShieldAlert,
  UserCheck,
  UserX,
  UserCog,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Better Auth pagination uses limit + offset
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const currentPage = useMemo(
    () => Math.floor(offset / limit) + 1,
    [offset, limit],
  );
  const totalPages = useMemo(
    () => (limit ? Math.max(1, Math.ceil(total / limit)) : 1),
    [total, limit],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // Fetch users via Better Auth admin.listUsers
  const fetchUsers = async (opts = {}) => {
    setLoading(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit,
          // ensure not negative
          offset: offset < 0 ? 0 : offset,
          searchValue: searchQuery.trim() || undefined,
          searchField: "name", // could switch to "email" dynamically
          searchOperator: "contains",
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (error) throw new Error(error.message || "Failed to list users");

      setUsers(data?.users || []);
      setTotal(data?.total || 0);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error("All fields required");
      return;
    }
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.createUser({
        email: createForm.email,
        password: createForm.password,
        name: createForm.name,
        role: createForm.role,
      });
      if (error) throw new Error(error.message || "Create failed");
      toast.success("User created");
      setCreateDialogOpen(false);
      setCreateForm({ name: "", email: "", password: "", role: "user" });
      await fetchUsers();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Ban / Unban
  const handleBanToggle = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const userId = selectedUser.id || selectedUser._id;
      if (!userId) throw new Error("No user id");
      if (selectedUser.banned) {
        const { error } = await authClient.admin.unbanUser({ userId });
        if (error) throw new Error(error.message || "Unban failed");
        toast.success("User unbanned");
      } else {
        const { error } = await authClient.admin.banUser({
          userId,
          banReason: "Banned by admin",
          // banExpiresIn: (optional seconds)
        });
        if (error) throw new Error(error.message || "Ban failed");
        toast.success("User banned");
      }
      setBanDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Role change
  const handleRoleChange = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const userId = selectedUser.id || selectedUser._id;
      const newRole = selectedUser.role === "admin" ? "user" : "admin";
      const { error } = await authClient.admin.setRole({
        userId,
        role: newRole,
      });
      if (error) throw new Error(error.message || "Role update failed");
      toast.success(`Role set to ${newRole}`);
      setRoleDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // reset to first page (offset 0)
    setOffset(0);
    fetchUsers({ reset: true });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setOffset(offset + limit);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setOffset(offset - limit);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, limit]);

  const displayedUsers = users; // already filtered on server via searchValue

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Users Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, bans, and access
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchUsers()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Search + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : displayedUsers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No users found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedUsers.map((u) => {
                    const userId = u.id || u._id;
                    return (
                      <TableRow key={userId}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={u.image || ""} alt={u.name} />
                              <AvatarFallback>
                                {(u.name || "?").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.role === "admin" ? "default" : "secondary"
                            }
                            className="flex items-center gap-1 w-fit capitalize"
                          >
                            {u.role === "admin" ? (
                              <Crown className="h-3 w-3" />
                            ) : (
                              <User className="h-3 w-3" />
                            )}
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.banned ? "destructive" : "secondary"}
                            className={
                              u.banned
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }
                          >
                            {u.banned ? "Banned" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString()
                              : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                aria-label="Actions"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${userId}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(u);
                                  setRoleDialogOpen(true);
                                }}
                                className={
                                  u.role === "admin"
                                    ? "text-orange-600"
                                    : "text-blue-600"
                                }
                              >
                                {u.role === "admin" ? (
                                  <>
                                    <ShieldOff className="h-4 w-4 mr-2" />
                                    Remove Admin
                                  </>
                                ) : (
                                  <>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Make Admin
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(u);
                                  setBanDialogOpen(true);
                                }}
                                className={
                                  u.banned ? "text-green-600" : "text-red-600"
                                }
                              >
                                {u.banned ? (
                                  <>
                                    <UnlockKeyhole className="h-4 w-4 mr-2" />
                                    Unban User
                                  </>
                                ) : (
                                  <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Ban User
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} • Showing{" "}
                    {displayedUsers.length} / {total}
                  </p>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Provision a new account via Better Auth Admin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ban / Unban */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.banned ? "Unban User" : "Ban User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.banned
                ? "User will regain access immediately."
                : "User will be prevented from signing in."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanToggle}
              disabled={actionLoading}
              className={cn(
                "bg-red-600 hover:bg-red-700",
                selectedUser?.banned && "bg-green-600 hover:bg-green-700",
              )}
            >
              {actionLoading
                ? "Processing..."
                : selectedUser?.banned
                  ? "Unban"
                  : "Ban"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Change */}
      <AlertDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Role</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.role === "admin"
                ? "This will remove administrative privileges."
                : "This will grant administrative privileges."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChange}
              disabled={actionLoading}
            >
              {actionLoading ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
