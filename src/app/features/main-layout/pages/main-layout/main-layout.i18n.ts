// src/app/layout/pages/main-layout/main-layout.i18n.ts
import { LangCode } from '../../../../shared/i18n/lang.types';

export interface MainLayoutTexts {
    topBrand: string;
    submenuMainLabel: string;
    submenuBackLabel: string;
    features: {
        home: string;
        applications: string;
        roles: string;
        menu: string;
        assignPagesRoles: string;
        assignRoles: string;
        points: string;
        reports: string;
    };
    reportsMenu: {
        section: string;
        rolesByUser: string;
        usersByRole: string;
        menuByRole: string;
        menuByPerson: string;
        admin: string;
        adminList: string;
        adminCreate: string;
        adminReports: string;
        adminMonthly: string;
        adminByUser: string;
        adminAudit: string;
    };
}

export const MAIN_LAYOUT_TEXTS: Record<LangCode, MainLayoutTexts> = {
    es: {
        topBrand: 'Administración',
        submenuMainLabel: 'MENÚ PRINCIPAL',
        submenuBackLabel: 'Volver al menú principal',
        features: {
            home: 'Inicio',
            applications: 'Gestionar aplicaciones',
            roles: 'Gestionar roles',
            menu: 'Menú',
            assignPagesRoles: 'Asignar pag. a roles',
            assignRoles: 'Asignar roles',
            points: 'Gestión de puntos',
            reports: 'Reportes'
        },
        reportsMenu: {
            section: 'Reportes',
            rolesByUser: 'Roles por Usuario',
            usersByRole: 'Usuarios por Rol',
            menuByRole: 'Menú de Rol',
            menuByPerson: 'Menú de Persona',
            admin: 'Administrador',
            adminList: 'Listado',
            adminCreate: 'Crear',
            adminReports: 'Reportes',
            adminMonthly: 'Mensual',
            adminByUser: 'Por usuario',
            adminAudit: 'Auditoría'
        }
    },
    en: {
        topBrand: 'Administration',
        submenuMainLabel: 'MAIN MENU',
        submenuBackLabel: 'Back to main menu',
        features: {
            home: 'Home',
            applications: 'Manage applications',
            roles: 'Manage roles',
            menu: 'Menu',
            assignPagesRoles: 'Assign pages to roles',
            assignRoles: 'Assign roles',
            points: 'Points management',
            reports: 'Reports'
        },
        reportsMenu: {
            section: 'Reports',
            rolesByUser: 'Roles by user',
            usersByRole: 'Users by role',
            menuByRole: 'Role menu',
            menuByPerson: 'Person menu',
            admin: 'Administrator',
            adminList: 'List',
            adminCreate: 'Create',
            adminReports: 'Reports',
            adminMonthly: 'Monthly',
            adminByUser: 'By user',
            adminAudit: 'Audit'
        }
    }
};
