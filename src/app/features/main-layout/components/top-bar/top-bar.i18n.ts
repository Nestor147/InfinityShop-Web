// src/app/features/layout/components/top-bar/top-bar.i18n.ts
import { LangCode } from '../../../../shared/i18n/lang.types';

export interface TopBarTexts {
    // Subtítulo bajo la marca
    subtitle: string;

    // Chip de estado
    statusChipLabel: string;       // "Estado: online" / "Status: online"
    statusRealtime: string;        // "Monitoreo en tiempo real" / "Real-time monitoring"

    // Bloque de sesiones / alertas
    sessionsLabel: string;         // "Sesiones" / "Sessions"
    alertsLabel: string;           // "Alertas" / "Alerts"

    // Botón de tema
    themeLabelLight: string;
    themeLabelDark: string;

    // Botón de idioma
    langShort: string;             // ES / EN
    langLong: string;              // Español / English
    langMenuAria: string;

    // ARIA
    sideMenuAria: string;
    themeAria: string;

    // Lanzador rápido
    quickAccessTitle: string;      // "Accesos rápidos"
    quickAccessProductivity: string;
    quickAccessUsers: string;
    quickAccessRoles: string;
    quickAccessPermissions: string;
    quickAccessAudit: string;
    quickAccessMonitor: string;
    quickAccessSettings: string;

    // Usuario
    userRoleLabel: string;         // "Administrador global"
    userSessionHint: string;
    userMenuProfile: string;
    userMenuLogout: string;

    // Etiquetas de idiomas en el menú (para mostrar en lista)
    langButtonLabel: string;       // "ES · Español" / "EN · English"
}

export const TOP_BAR_TEXTS: Record<LangCode, TopBarTexts> = {
    es: {
        subtitle: 'Consola de seguridad · Panel unificado',

        statusChipLabel: 'Estado: online',
        statusRealtime: 'Monitoreo en tiempo real',

        sessionsLabel: 'Sesiones',
        alertsLabel: 'Alertas',

        themeLabelLight: 'Modo claro',
        themeLabelDark: 'Modo oscuro',

        langShort: 'ES',
        langLong: 'Español',
        langMenuAria: 'Seleccionar idioma de la consola',

        sideMenuAria: 'Abrir menú lateral',
        themeAria: 'Cambiar tema',

        quickAccessTitle: 'Accesos rápidos',
        quickAccessProductivity: 'Productividad',
        quickAccessUsers: 'Usuarios',
        quickAccessRoles: 'Roles',
        quickAccessPermissions: 'Permisos',
        quickAccessAudit: 'Auditoría',
        quickAccessMonitor: 'Monitor',
        quickAccessSettings: 'Ajustes',

        userRoleLabel: 'Administrador global',
        userSessionHint: 'Sesión vinculada a credenciales verificadas.',
        userMenuProfile: 'Mi cuenta',
        userMenuLogout: 'Cerrar sesión',

        langButtonLabel: 'ES · Español'
    },

    en: {
        subtitle: 'Security console · Unified panel',

        statusChipLabel: 'Status: online',
        statusRealtime: 'Real-time monitoring',

        sessionsLabel: 'Sessions',
        alertsLabel: 'Alerts',

        themeLabelLight: 'Light mode',
        themeLabelDark: 'Dark mode',

        langShort: 'EN',
        langLong: 'English',
        langMenuAria: 'Select console language',

        sideMenuAria: 'Open sidebar menu',
        themeAria: 'Toggle theme',

        quickAccessTitle: 'Quick access',
        quickAccessProductivity: 'Productivity',
        quickAccessUsers: 'Users',
        quickAccessRoles: 'Roles',
        quickAccessPermissions: 'Permissions',
        quickAccessAudit: 'Audit',
        quickAccessMonitor: 'Monitor',
        quickAccessSettings: 'Settings',

        userRoleLabel: 'Global administrator',
        userSessionHint: 'Session linked to verified credentials.',
        userMenuProfile: 'My account',
        userMenuLogout: 'Sign out',

        langButtonLabel: 'EN · English'
    }
};
