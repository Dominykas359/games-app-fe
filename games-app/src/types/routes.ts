export const AppRoutes = {

    LOG_IN: '/login',
    SIGN_UP: '/signup',
    LOG_OUT: '/logout',

    FRIENDS: '/friends',
    GAMES: '/games',
    SETTINGS: '/settings',
    LEADERBOARD: '/leaderboard',
    ERROR_PAGE: '/error',

    ROOT: '/'

} as const;

export type AppRoutes = typeof AppRoutes[keyof typeof AppRoutes];

export const errorPageDisplayPages = [
  
    AppRoutes.LOG_IN,
    AppRoutes.SIGN_UP,
    AppRoutes.FRIENDS,
    AppRoutes.GAMES,
    AppRoutes.LEADERBOARD,
    AppRoutes.LOG_OUT,
    AppRoutes.SETTINGS,
    AppRoutes.ROOT
  ];
  
  export type ErrorPageDisplayPages = typeof errorPageDisplayPages[number];
  
  export const displayError = [
    AppRoutes.GAMES,
    AppRoutes.FRIENDS,
    AppRoutes.LEADERBOARD,
    AppRoutes.SETTINGS,
    AppRoutes.ROOT
  ];
  
  export type DisplayError = typeof displayError[number];
