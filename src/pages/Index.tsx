import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type EquipmentStatus = 'issued' | 'reserve-ready' | 'reserve-not-ready' | 'reserve-no-issue';
type EquipmentType = 'laptop' | 'printer' | 'cartridge' | 'monitor' | 'smartphone' | 'mouse' | 'keyboard';

interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  model: string;
  serialNumber: string;
  status: EquipmentStatus;
  assignedTo?: string;
}

const statusConfig = {
  'issued': { label: 'Выдан', color: 'bg-blue-500' },
  'reserve-ready': { label: 'Резерв, готов к выдаче', color: 'bg-green-500' },
  'reserve-not-ready': { label: 'Резерв не готов к выдаче', color: 'bg-yellow-500' },
  'reserve-no-issue': { label: 'Резерв, не выдаем', color: 'bg-gray-500' }
};

const typeConfig = {
  'laptop': { label: 'Ноутбук', icon: 'Laptop' },
  'printer': { label: 'Принтер', icon: 'Printer' },
  'cartridge': { label: 'Картридж', icon: 'Package' },
  'monitor': { label: 'Монитор', icon: 'Monitor' },
  'smartphone': { label: 'Смартфон', icon: 'Smartphone' },
  'mouse': { label: 'Мышка', icon: 'Mouse' },
  'keyboard': { label: 'Клавиатура', icon: 'Keyboard' }
};

const mockData: Equipment[] = [
  { id: 1, name: 'Dell Latitude 5420', type: 'laptop', model: 'Latitude 5420', serialNumber: 'DL5420-001', status: 'issued', assignedTo: 'Иванов И.И.' },
  { id: 2, name: 'HP LaserJet Pro', type: 'printer', model: 'LaserJet Pro M404', serialNumber: 'HP404-002', status: 'reserve-ready' },
  { id: 3, name: 'Картридж HP 80A', type: 'cartridge', model: 'CF280A', serialNumber: 'CF280A-012', status: 'reserve-ready' },
  { id: 4, name: 'Lenovo ThinkPad T14', type: 'laptop', model: 'ThinkPad T14', serialNumber: 'TP14-003', status: 'reserve-not-ready' },
  { id: 5, name: 'Dell UltraSharp U2722D', type: 'monitor', model: 'U2722D', serialNumber: 'U2722D-004', status: 'issued', assignedTo: 'Петров П.П.' },
  { id: 6, name: 'iPhone 13', type: 'smartphone', model: 'iPhone 13 128GB', serialNumber: 'IP13-005', status: 'issued', assignedTo: 'Сидоров С.С.' },
  { id: 7, name: 'Logitech MX Master 3', type: 'mouse', model: 'MX Master 3', serialNumber: 'MX3-006', status: 'reserve-ready' },
  { id: 8, name: 'Keychron K8', type: 'keyboard', model: 'K8 Pro', serialNumber: 'K8-007', status: 'issued', assignedTo: 'Иванов И.И.' },
  { id: 9, name: 'MacBook Pro 14', type: 'laptop', model: 'MacBook Pro 14"', serialNumber: 'MBP14-008', status: 'reserve-no-issue' },
  { id: 10, name: 'Canon PIXMA', type: 'printer', model: 'PIXMA G3420', serialNumber: 'G3420-009', status: 'issued', assignedTo: 'Козлов К.К.' },
];

export default function Index() {
  const [equipment] = useState<Equipment[]>(mockData);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipment = equipment.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: equipment.length,
    issued: equipment.filter(e => e.status === 'issued').length,
    reserveReady: equipment.filter(e => e.status === 'reserve-ready').length,
    reserveNotReady: equipment.filter(e => e.status === 'reserve-not-ready').length,
    reserveNoIssue: equipment.filter(e => e.status === 'reserve-no-issue').length,
  };

  const typeStats = Object.keys(typeConfig).map(type => ({
    type: type as EquipmentType,
    count: equipment.filter(e => e.type === type).length
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Server" size={28} />
              <h1 className="text-2xl font-bold">IT Asset Management</h1>
            </div>
            <Button variant="outline" className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить оборудование
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего оборудования</CardTitle>
              <Icon name="Package" size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Выдано</CardTitle>
              <Icon name="CheckCircle" size={20} className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.issued}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Готов к выдаче</CardTitle>
              <Icon name="CircleCheck" size={20} className="text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.reserveReady}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Не готов</CardTitle>
              <Icon name="AlertCircle" size={20} className="text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.reserveNotReady}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Не выдаем</CardTitle>
              <Icon name="XCircle" size={20} className="text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-500">{stats.reserveNoIssue}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BarChart3" size={22} />
                Распределение по типам оборудования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {typeStats.map(({ type, count }) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name={typeConfig[type].icon as any} size={20} className="text-muted-foreground" />
                      <span className="font-medium">{typeConfig[type].label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold min-w-[2rem] text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" size={22} />
                Статистика по статусам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Выдан</span>
                  </div>
                  <span className="font-bold">{stats.issued}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Готов к выдаче</span>
                  </div>
                  <span className="font-bold">{stats.reserveReady}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Не готов</span>
                  </div>
                  <span className="font-bold">{stats.reserveNotReady}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="text-sm">Не выдаем</span>
                  </div>
                  <span className="font-bold">{stats.reserveNoIssue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Icon name="List" size={22} />
                Реестр оборудования
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Icon name="Grid3x3" size={16} />
                  <span className="hidden sm:inline">Все</span>
                </TabsTrigger>
                {Object.entries(typeConfig).map(([key, { label, icon }]) => (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                    <Icon name={icon as any} size={16} />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Тип</TableHead>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Модель</TableHead>
                    <TableHead>Серийный номер</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Закреплен за</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Оборудование не найдено
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipment.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon name={typeConfig[item.type].icon as any} size={18} className="text-muted-foreground" />
                            <span className="text-sm">{typeConfig[item.type].label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.model}</TableCell>
                        <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${statusConfig[item.status].color} text-white`}>
                            {statusConfig[item.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.assignedTo || '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}