export const AppRoutes = {

    LOG_IN: '/login',
    SIGN_UP: '/signup',
    LOG_OUT: '/logout',

    FRIENDS: '/friends',
    GAMES: '/games',
    ROCKPAPERSCISSORS: '/games/d62c84a7-27af-40b8-b96d-1b174c0c6448',
    TICTACTOE: '/games/a196a4d1-08cb-4a26-9e17-769f6c4daec2',
    ROULLETE: '/games/6728f513-f829-4f28-ad8e-62489ef12c86',
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
