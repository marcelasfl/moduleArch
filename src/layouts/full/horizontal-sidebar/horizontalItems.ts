import {
    FilesIcon, SchoolIcon, UserCircleIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    divider?: boolean;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    subCaption?: string;
    class?: string;
    extraclass?: string;
    type?: string;
}

const horizontalItems: menu[] = [
    {
        title: 'Bolsas',
        icon: SchoolIcon,
        children: [
            {
                title: "Modalidades",
                to: "/modalidade/IndexModalidade",
            },
        ]
    },
    {
        title: 'Editais',
        icon: FilesIcon,
        children: [
            {
                title: "Resoluções",
                to: "/resolucao/IndexResolucao",
            },
            {
                title: "Importações",
                to: "/importaredital/IndexImportarEdital",
            },
              
            {
                title: "Editais não importados",
                to: "/importaredital/EditaisErro",
            },
        ]
    },
    {
        title: 'Perfil',
        icon: UserCircleIcon,
        to: "/perfil/PerfilUsuario",
    }
];

export default horizontalItems;
