import { useCustomizerStore } from '@/stores/customizer';
import * as themeColors from '@/theme/LightTheme';
import { computed } from 'vue';

const custmizer = useCustomizerStore();

const getPrimary = computed(() => {
    return themeColors.BLUE_THEME.colors.primary;
});

const getdashboardcolorRed = computed(() => {
    return themeColors.BLUE_THEME.colors.dashboardcolorRed;
});

const getdashboardcolorYellow = computed(() => {
    return themeColors.BLUE_THEME.colors.dashboardcolorYellow;
})

const getLightPrimary = computed(() => {
    return themeColors.BLUE_THEME.colors.lightprimary;
});

const getdashboardcolorDarkGreen = computed(() => {
    return themeColors.BLUE_THEME.colors.dashboardcolorDarkGreen
})

const getdashboardcolorBlue = computed(() => {
    return themeColors.BLUE_THEME.colors.dashboardcolorBlue
})

const getSecondary = computed(() => {
    return themeColors.BLUE_THEME.colors.secondary;
});

const getLightSecondary = computed(() => {
    return themeColors.BLUE_THEME.colors.lightsecondary;
});

const getLight100 = computed(() => {
    return themeColors.BLUE_THEME.colors.grey100;
});

export { getdashboardcolorDarkGreen, getdashboardcolorBlue, getdashboardcolorRed, getdashboardcolorYellow, getLight100, getLightPrimary, getLightSecondary, getPrimary, getSecondary };

