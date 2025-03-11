import {
  CalendarIcon,  CoinIcon,   DashboardIcon,  FileImportIcon, FileOffIcon, FilePencilIcon,  UserCircleIcon, ClipboardCheckIcon,  TargetIcon,  FileDescriptionIcon,  FileIcon,
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [ 
  {
    title: 'Dashboards',
    icon: DashboardIcon,
    to: '/Dashboard'
  },

  { header: 'Bolsas'},
  {
    title: 'Modalidades',
    icon: CoinIcon,
    to: "/modalidade/IndexModalidade",
  },

  { header: 'Editais'},
  {
    title: "Resoluções",
    icon: FilePencilIcon,
    to: "/resolucao/IndexResolucao",
  },
  {
    title: "Importações",
    icon: FileImportIcon,
    to: "/importaredital/IndexImportarEdital",
  },
  {
    title: "Não Importados",
    icon: FileOffIcon,
    to: "/importaredital/EditaisErro",
  },
  {
    title: "Editais",
    icon: FileDescriptionIcon,
    to: "/pagamento/VisualizarEditais"
  },
  
  { header: 'Pagamento'},
  {
    title: 'Calendário',
    icon: CalendarIcon,
    to: '/pagamento/VisualizarCalendario'
  },
  {
    title: 'Liberar editais',
    icon: ClipboardCheckIcon,
    to: '/pagamento/LiberarEditaisPagamento'
  },
  {
    title: 'Monitorar liberação',
    icon: TargetIcon,
    to: '/pagamento/MonitorarLiberacao'
  },
  {
    title: 'Listar folha',
    icon: FileIcon,
    to: '/pagamento/ListarFolha'
  },
  {
    title: 'Listar folha - DIRAF',
    icon: FileIcon,
    to: '/pagamento/ListarFolhaDiraf'
  },

  { header: 'Usuário'},
  {
    title: 'Perfil',
    icon: UserCircleIcon,
    to: "/perfil/PerfilUsuario",
  }
];

export default sidebarItem;
