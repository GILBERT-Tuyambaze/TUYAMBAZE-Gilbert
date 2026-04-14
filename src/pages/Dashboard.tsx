import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  deleteSocialEntry,
  getCurrentAdminRole,
  getDashboardData,
  loginAdmin,
  logoutAdmin,
  setVisitorCountValue,
  updateSocialEntry,
  watchAdminUser,
  type ContactSubmission,
  type SocialProofKind,
  type Testimonial,
} from '@/lib/portfolioData';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  MessageSquareQuote,
  RefreshCcw,
  Save,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';

const formatDate = (value: Date | null, language: string) =>
  value
    ? new Intl.DateTimeFormat(language, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(value)
    : '--';

const createEditorState = (entry: Testimonial) => ({
  id: entry.id,
  kind: entry.kind,
  name: entry.name,
  role: entry.role,
  company: entry.company,
  message: entry.message,
  rating: entry.rating,
  visible: entry.visible,
});

const dashboardErrorMessage = (fallback: string, error: unknown) => {
  if (error instanceof Error && /permission|insufficient/i.test(error.message)) {
    return fallback;
  }
  return fallback;
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [authReady, setAuthReady] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string | null } | null>(null);
  const [roleReady, setRoleReady] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [dataError, setDataError] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [socialEntries, setSocialEntries] = useState<Testimonial[]>([]);
  const [visitorCountInput, setVisitorCountInput] = useState('0');
  const [savingVisitorCount, setSavingVisitorCount] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editor, setEditor] = useState<ReturnType<typeof createEditorState> | null>(null);
  const [savingEditor, setSavingEditor] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = watchAdminUser((user) => {
      if (user && !user.isAnonymous) {
        setAdminUser({ email: user.email });
      } else {
        setAdminUser(null);
        setHasAdminAccess(false);
        setRoleReady(true);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!adminUser) return;

    setRoleReady(false);
    void getCurrentAdminRole()
      .then((role) => {
        setHasAdminAccess(role?.role === 'admin');
        setRoleReady(true);
      })
      .catch(() => {
        setHasAdminAccess(false);
        setRoleReady(true);
      });
  }, [adminUser]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    setDataError('');

    try {
      const data = await getDashboardData();
      setContactSubmissions(data.contactSubmissions);
      setSocialEntries(data.testimonials);
      setVisitorCountInput(String(data.visitorCount));
    } catch (error) {
      setDataError(
        dashboardErrorMessage(
          t('dashboard.errors.load', {
            defaultValue: 'Dashboard data is temporarily unavailable. Please confirm your admin access and Firestore rules, then try again.',
          }),
          error
        )
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!adminUser || !hasAdminAccess) return;
    void loadDashboardData();
  }, [adminUser, hasAdminAccess]);

  const visibleEntriesCount = useMemo(
    () => socialEntries.filter((entry) => entry.visible).length,
    [socialEntries]
  );

  const hiddenEntriesCount = useMemo(
    () => socialEntries.filter((entry) => !entry.visible).length,
    [socialEntries]
  );

  const feedbackCount = useMemo(
    () => socialEntries.filter((entry) => entry.kind === 'feedback').length,
    [socialEntries]
  );

  const testimonialCount = useMemo(
    () => socialEntries.filter((entry) => entry.kind === 'testimonial').length,
    [socialEntries]
  );

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');

    try {
      await loginAdmin(email, password);
      setPassword('');
    } catch (error) {
      setAuthError(
        dashboardErrorMessage(
          t('dashboard.errors.login', {
            defaultValue: 'Access denied. Please check your admin email and password.',
          }),
          error
        )
      );
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
  };

  const handleSaveVisitorCount = async () => {
    const nextValue = Number(visitorCountInput);
    if (!Number.isFinite(nextValue) || nextValue < 0) {
      setActionError(
        t('dashboard.errors.invalidCounter', {
          defaultValue: 'Visitor count must be a valid number greater than or equal to zero.',
        })
      );
      return;
    }

    setSavingVisitorCount(true);
    setActionError('');
    setActionMessage('');
    try {
      await setVisitorCountValue(nextValue);
      setActionMessage(
        t('dashboard.messages.counterSaved', {
          defaultValue: 'Visitor count updated successfully.',
        })
      );
    } catch {
      setActionError(
        t('dashboard.errors.counterSave', {
          defaultValue: 'The visitor count could not be updated right now. Please try again.',
        })
      );
    } finally {
      setSavingVisitorCount(false);
    }
  };

  const handleAdjustVisitorCount = (amount: number) => {
    const current = Number(visitorCountInput);
    const safeCurrent = Number.isFinite(current) ? current : 0;
    setVisitorCountInput(String(Math.max(0, safeCurrent + amount)));
  };

  const startEditing = (entry: Testimonial) => {
    setEditingEntryId(entry.id);
    setEditor(createEditorState(entry));
    setActionError('');
    setActionMessage('');
  };

  const handleEditorChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editor) return;
    const { name, value } = event.target;
    setEditor({
      ...editor,
      [name]:
        name === 'rating'
          ? Number(value)
          : name === 'visible'
          ? value === 'true'
          : name === 'kind'
          ? (value as SocialProofKind)
          : value,
    });
  };

  const handleSaveEntry = async () => {
    if (!editor) return;
    setSavingEditor(true);
    setActionError('');
    setActionMessage('');
    try {
      await updateSocialEntry(editor);
      setEditingEntryId(null);
      setEditor(null);
      await loadDashboardData();
      setActionMessage(
        t('dashboard.messages.entrySaved', {
          defaultValue: 'The social entry was updated successfully.',
        })
      );
    } catch {
      setActionError(
        t('dashboard.errors.entrySave', {
          defaultValue: 'That entry could not be updated right now. Please try again.',
        })
      );
    } finally {
      setSavingEditor(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    setDeletingEntryId(entryId);
    setActionError('');
    setActionMessage('');
    try {
      await deleteSocialEntry(entryId);
      if (editingEntryId === entryId) {
        setEditingEntryId(null);
        setEditor(null);
      }
      await loadDashboardData();
      setActionMessage(
        t('dashboard.messages.entryDeleted', {
          defaultValue: 'The social entry was deleted successfully.',
        })
      );
    } catch {
      setActionError(
        t('dashboard.errors.entryDelete', {
          defaultValue: 'That entry could not be deleted right now. Please try again.',
        })
      );
    } finally {
      setDeletingEntryId(null);
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 text-foreground">
        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle>{t('dashboard.setupTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>{t('dashboard.setupDescription')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!authReady) {
    return <div className="min-h-screen bg-background px-4 py-12 text-foreground">{t('dashboard.loading')}</div>;
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.12),transparent_24%),linear-gradient(180deg,#020617,#030712)] px-4 py-12 text-foreground">
        <div className="mx-auto max-w-md">
          <Card className="border-cyan-500/20 bg-slate-950/90 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-cyan-400/30 bg-cyan-400/10 font-mono text-cyan-300">
                {t('dashboard.badge')}
              </Badge>
              <CardTitle className="font-mono text-3xl tracking-[0.14em] text-cyan-100">
                {t('dashboard.signInTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-email">{t('dashboard.fields.email')}</Label>
                  <Input id="dashboard-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dashboard-password">{t('dashboard.fields.password')}</Label>
                  <Input id="dashboard-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  {t('dashboard.signIn')}
                </Button>
                {authError ? <p className="text-sm text-rose-400">{authError}</p> : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!roleReady) {
    return <div className="min-h-screen bg-background px-4 py-12 text-foreground">{t('dashboard.checking')}</div>;
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 text-foreground">
        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle>{t('dashboard.roleTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>{t('dashboard.roleDescription')}</p>
              <Button variant="outline" onClick={() => void handleLogout()}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('dashboard.logout')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen px-4 py-8 text-slate-100">
      <div className="dashboard-shell__backdrop" aria-hidden="true" />
      <div className="dashboard-shell__grid" aria-hidden="true" />
      <div className="dashboard-shell__particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="dashboard-shell__scanline" aria-hidden="true" />
      <div className="dashboard-shell__frame mx-auto max-w-7xl space-y-8">
        <div className="dashboard-panel dashboard-panel--hero overflow-hidden rounded-[2rem]">
          <div className="dashboard-panel__hudline" aria-hidden="true" />
          <div className="border-b border-cyan-400/10 bg-[linear-gradient(90deg,rgba(34,211,238,0.12),transparent,rgba(167,139,250,0.14))] px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Badge variant="outline" className="dashboard-badge mb-4 border-cyan-400/30 bg-cyan-400/10 font-mono text-cyan-300">
                  {t('dashboard.badge')}
                </Badge>
                <h1 className="dashboard-title font-mono text-3xl tracking-[0.16em] text-cyan-100 md:text-4xl">
                  {t('dashboard.title')}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/90">
                  {t('dashboard.description', { email: adminUser.email ?? 'admin' })}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild className="dashboard-action border-cyan-500/30 bg-slate-900/70 text-cyan-100 hover:bg-cyan-500/10">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('dashboard.back')}
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => void loadDashboardData()} disabled={loadingData} className="dashboard-action border-cyan-500/30 bg-slate-900/70 text-cyan-100 hover:bg-cyan-500/10">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {t('dashboard.refresh')}
                </Button>
                <Button variant="outline" onClick={() => void handleLogout()} className="dashboard-action border-rose-500/30 bg-slate-900/70 text-rose-200 hover:bg-rose-500/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('dashboard.logout')}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
            {[
              { label: t('dashboard.stats.messages'), value: contactSubmissions.length, icon: Mail },
              { label: t('dashboard.stats.totalSocial'), value: socialEntries.length, icon: MessageSquareQuote },
              { label: t('dashboard.stats.visible'), value: visibleEntriesCount, icon: Eye },
              { label: t('dashboard.stats.hidden'), value: hiddenEntriesCount, icon: EyeOff },
              { label: t('dashboard.stats.visitors'), value: visitorCountInput, icon: Users },
            ].map((item) => (
              <Card key={item.label} className="dashboard-panel dashboard-panel--metric border-cyan-500/15 bg-slate-900/70 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.04)]">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                    <p className="dashboard-metric mt-3 font-mono text-4xl text-cyan-100">{item.value}</p>
                  </div>
                  <item.icon className="h-9 w-9 text-cyan-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {dataError ? (
          <Card className="dashboard-panel border-rose-500/30 bg-rose-500/10">
            <CardContent className="p-4 text-sm text-rose-200">{dataError}</CardContent>
          </Card>
        ) : null}
        {actionError ? (
          <Card className="dashboard-panel border-rose-500/30 bg-rose-500/10">
            <CardContent aria-live="polite" className="p-4 text-sm text-rose-200">{actionError}</CardContent>
          </Card>
        ) : null}
        {actionMessage ? (
          <Card className="dashboard-panel border-emerald-500/30 bg-emerald-500/10">
            <CardContent aria-live="polite" className="p-4 text-sm text-emerald-200">{actionMessage}</CardContent>
          </Card>
        ) : null}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="dashboard-tabs h-auto flex-wrap justify-start gap-2 rounded-2xl border border-cyan-500/10 bg-slate-950/70 p-2">
            <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="messages">{t('dashboard.tabs.messages')}</TabsTrigger>
            <TabsTrigger value="social">{t('dashboard.tabs.social')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <Card className="dashboard-panel border-cyan-500/15 bg-slate-950/80">
                <CardHeader>
                  <CardTitle className="dashboard-section-title flex items-center gap-2 font-mono text-cyan-100">
                    <Activity className="h-5 w-5 text-cyan-300" />
                    {t('dashboard.counterTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="visitor-count">{t('dashboard.counterLabel')}</Label>
                    <Input
                      id="visitor-count"
                      type="number"
                      min={0}
                      value={visitorCountInput}
                      onChange={(event) => setVisitorCountInput(event.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => handleAdjustVisitorCount(100)} className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100">+100</Button>
                    <Button variant="outline" onClick={() => handleAdjustVisitorCount(500)} className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100">+500</Button>
                    <Button variant="outline" onClick={() => handleAdjustVisitorCount(1000)} className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100">+1000</Button>
                    <Button onClick={() => void handleSaveVisitorCount()} disabled={savingVisitorCount} className="dashboard-action bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                      {savingVisitorCount ? t('dashboard.saving') : t('dashboard.save')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-panel border-cyan-500/15 bg-slate-950/80">
                <CardHeader>
                  <CardTitle className="dashboard-section-title flex items-center gap-2 font-mono text-cyan-100">
                    <Shield className="h-5 w-5 text-cyan-300" />
                    {t('dashboard.socialSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-slate-300">
                  <div className="dashboard-panel rounded-xl border border-cyan-500/10 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{t('dashboard.kinds.testimonial')}</p>
                    <p className="mt-2 font-mono text-3xl text-cyan-100">{testimonialCount}</p>
                  </div>
                  <div className="dashboard-panel rounded-xl border border-cyan-500/10 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{t('dashboard.kinds.feedback')}</p>
                    <p className="mt-2 font-mono text-3xl text-cyan-100">{feedbackCount}</p>
                  </div>
                  <p>{t('dashboard.summaryText')}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="dashboard-panel border-cyan-500/15 bg-slate-950/80">
              <CardHeader>
                <CardTitle className="dashboard-section-title font-mono text-cyan-100">{t('dashboard.messagesTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 md:hidden">
                  {contactSubmissions.length > 0 ? contactSubmissions.map((entry) => (
                    <div key={entry.id} className="dashboard-panel rounded-2xl border border-cyan-500/10 bg-slate-900/55 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-100">{entry.name}</p>
                          <a className="text-sm text-cyan-300 hover:underline" href={`mailto:${entry.email}`}>{entry.email}</a>
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(entry.createdAt, i18n.language)}</span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-cyan-100">{entry.subject}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{entry.message}</p>
                    </div>
                  )) : (
                    <p className="text-center text-slate-400">{t('dashboard.emptyMessages')}</p>
                  )}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('dashboard.table.sender')}</TableHead>
                        <TableHead>{t('dashboard.table.subject')}</TableHead>
                        <TableHead>{t('dashboard.table.message')}</TableHead>
                        <TableHead>{t('dashboard.table.received')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactSubmissions.length > 0 ? contactSubmissions.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <div className="font-medium text-slate-100">{entry.name}</div>
                            <a className="text-sm text-cyan-300 hover:underline" href={`mailto:${entry.email}`}>{entry.email}</a>
                          </TableCell>
                          <TableCell>{entry.subject}</TableCell>
                          <TableCell className="max-w-md whitespace-pre-wrap text-slate-300">{entry.message}</TableCell>
                          <TableCell>{formatDate(entry.createdAt, i18n.language)}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-400">{t('dashboard.emptyMessages')}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card className="dashboard-panel border-cyan-500/15 bg-slate-950/80">
              <CardHeader>
                <CardTitle className="dashboard-section-title font-mono text-cyan-100">{t('dashboard.socialTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 md:hidden">
                  {socialEntries.length > 0 ? socialEntries.map((entry) => (
                    <div key={entry.id} className="dashboard-panel rounded-2xl border border-cyan-500/10 bg-slate-900/55 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Badge variant={entry.kind === 'testimonial' ? 'default' : 'secondary'} className="dashboard-badge">
                          {entry.kind === 'testimonial' ? t('dashboard.kinds.testimonial') : t('dashboard.kinds.feedback')}
                        </Badge>
                        <Badge variant={entry.visible ? 'default' : 'outline'} className="dashboard-badge">
                          {entry.visible ? t('dashboard.visible') : t('dashboard.hidden')}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="font-medium text-slate-100">{entry.name}</p>
                        <p className="text-sm text-slate-400">{[entry.role, entry.company].filter(Boolean).join(' at ')}</p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{entry.message}</p>
                        <p className="mt-3 text-xs text-slate-400">{formatDate(entry.createdAt, i18n.language)}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditing(entry)} className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100">
                          {t('dashboard.edit')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void (async () => {
                            setActionError('');
                            setActionMessage('');
                            try {
                              await updateSocialEntry({ ...entry, visible: !entry.visible });
                              await loadDashboardData();
                            } catch {
                              setActionError(t('dashboard.errors.entrySave', { defaultValue: 'That entry could not be updated right now. Please try again.' }));
                            }
                          })()}
                          className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100"
                        >
                          {entry.visible ? t('dashboard.hide') : t('dashboard.show')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => void handleDeleteEntry(entry.id)}
                          disabled={deletingEntryId === entry.id}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          {t('dashboard.delete')}
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-slate-400">{t('dashboard.emptySocial')}</p>
                  )}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <Table className="min-w-[980px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('dashboard.table.type')}</TableHead>
                        <TableHead>{t('dashboard.table.author')}</TableHead>
                        <TableHead>{t('dashboard.table.message')}</TableHead>
                        <TableHead>{t('dashboard.table.visibility')}</TableHead>
                        <TableHead>{t('dashboard.table.received')}</TableHead>
                        <TableHead>{t('dashboard.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {socialEntries.length > 0 ? socialEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <Badge variant={entry.kind === 'testimonial' ? 'default' : 'secondary'} className="dashboard-badge">
                              {entry.kind === 'testimonial' ? t('dashboard.kinds.testimonial') : t('dashboard.kinds.feedback')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-100">{entry.name}</div>
                            <div className="text-sm text-slate-400">{[entry.role, entry.company].filter(Boolean).join(' at ')}</div>
                          </TableCell>
                          <TableCell className="max-w-md whitespace-pre-wrap text-slate-300">{entry.message}</TableCell>
                          <TableCell>
                            <Badge variant={entry.visible ? 'default' : 'outline'} className="dashboard-badge">
                              {entry.visible ? t('dashboard.visible') : t('dashboard.hidden')}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(entry.createdAt, i18n.language)}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" onClick={() => startEditing(entry)} className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100">
                                {t('dashboard.edit')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => void (async () => {
                                  setActionError('');
                                  setActionMessage('');
                                  try {
                                    await updateSocialEntry({ ...entry, visible: !entry.visible });
                                    await loadDashboardData();
                                  } catch {
                                    setActionError(t('dashboard.errors.entrySave', { defaultValue: 'That entry could not be updated right now. Please try again.' }));
                                  }
                                })()}
                                className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100"
                              >
                                {entry.visible ? t('dashboard.hide') : t('dashboard.show')}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => void handleDeleteEntry(entry.id)}
                                disabled={deletingEntryId === entry.id}
                              >
                                <Trash2 className="mr-1 h-3.5 w-3.5" />
                                {t('dashboard.delete')}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-slate-400">{t('dashboard.emptySocial')}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {editor && editingEntryId ? (
              <Card className="dashboard-panel border-cyan-500/15 bg-slate-950/80">
                <CardHeader>
                  <CardTitle className="dashboard-section-title font-mono text-cyan-100">{t('dashboard.editorTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="editor-kind">{t('dashboard.table.type')}</Label>
                    <select id="editor-kind" name="kind" value={editor.kind} onChange={handleEditorChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                      <option value="testimonial">{t('dashboard.kinds.testimonial')}</option>
                      <option value="feedback">{t('dashboard.kinds.feedback')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editor-visibility">{t('dashboard.table.visibility')}</Label>
                    <select id="editor-visibility" name="visible" value={String(editor.visible)} onChange={handleEditorChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                      <option value="true">{t('dashboard.visible')}</option>
                      <option value="false">{t('dashboard.hidden')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editor-name">{t('socialProof.form.name')}</Label>
                    <Input id="editor-name" name="name" value={editor.name} onChange={handleEditorChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editor-role">{t('socialProof.form.role')}</Label>
                    <Input id="editor-role" name="role" value={editor.role} onChange={handleEditorChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editor-company">{t('socialProof.form.company')}</Label>
                    <Input id="editor-company" name="company" value={editor.company} onChange={handleEditorChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editor-rating">{t('socialProof.form.rating')}</Label>
                    <Input id="editor-rating" name="rating" type="number" min={1} max={5} value={editor.rating} onChange={handleEditorChange} />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="editor-message">{t('socialProof.form.message')}</Label>
                    <Textarea id="editor-message" name="message" rows={6} value={editor.message} onChange={handleEditorChange} />
                  </div>
                  <div className="flex flex-wrap gap-3 lg:col-span-2">
                    <Button onClick={() => void handleSaveEntry()} disabled={savingEditor} className="dashboard-action bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                      <Save className="mr-2 h-4 w-4" />
                      {savingEditor ? t('dashboard.saving') : t('dashboard.saveChanges')}
                    </Button>
                    <Button variant="outline" onClick={() => { setEditingEntryId(null); setEditor(null); }} className="dashboard-action border-cyan-500/20 bg-slate-900/60 text-cyan-100">
                      {t('dashboard.cancel')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
