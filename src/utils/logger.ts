import chalk from 'chalk';
import figlet from 'figlet';

/**
 * Logger interface for logging messages with different styles.
 * @returns {Logger} An object with methods for logging messages.
 */
export const log = (): Logger => ({
  info: (...args: unknown[]) => console.info(...args),
  error: (...args: unknown[]) => console.error(styled.error(args.join(' '))),
  yellow: (...args: unknown[]) => console.info(chalk.yellow(args.join(' '))),
  green: (...args: unknown[]) => console.info(chalk.green(args.join(' '))),
  red: (...args: unknown[]) => console.info(chalk.red(args.join(' '))),
  cyan: (...args: unknown[]) => console.info(chalk.cyan(args.join(' '))),
  magenta: (...args: unknown[]) => console.info(chalk.magenta(args.join(' '))),
  blue: (...args: unknown[]) => console.info(chalk.blue(args.join(' '))),
  gray: (...args: unknown[]) => console.info(chalk.gray(args.join(' '))),
  bold: (...args: unknown[]) => console.info(chalk.bold(args.join(' '))),
  dim: (...args: unknown[]) => console.info(chalk.dim(args.join(' '))),
  underline: (...args: unknown[]) => console.info(chalk.underline(args.join(' '))),
  italic: (...args: unknown[]) => console.info(chalk.italic(args.join(' '))),
  warning: (...args: unknown[]) => console.info(styled.warning(args.join(' '))),
  success: (...args: unknown[]) => console.info(styled.success(args.join(' '))),
});

/**
 * Styled interface for styled text messages.
 * @returns {Styled} An object with methods for styled text messages.
 */
export const styled: Styled = {
  success: (text: string) => chalk.green.bold(`✅ ${text}`),
  error: (text: string) => chalk.red.bold(`❌ ${text}`),
  warning: (text: string) => chalk.yellow.bold(`⚠️  ${text}`),
  info: (text: string) => chalk.blue.bold(`ℹ️  ${text}`),
  highlight: (text: string) => chalk.cyan.bold.underline(text),
  subtle: (text: string) => chalk.gray.dim(text),
  emphasis: (text: string) => chalk.yellow.italic(text),
  filename: (text: string) => chalk.green.bold.underline(text),
  command: (text: string) => chalk.blue.italic(`\`${text}\``),
  url: (text: string) => chalk.cyan.underline(text),
};

/**
 * Displays a banner with the Playwright and Flake Checker logos.
 * @returns {void}
 */
export const displayBanner = (): void => {
  log().info(figlet.textSync('PLAYWRIGHT', { font: 'ANSI Shadow', horizontalLayout: 'full' }));
  log().info(`
                                    ****
                                   #*******
                                  ##*********
                                 ##************
                                ##****************
                               ##*********************
                               #****************************
                           ++++******************************++++++++++++ *++++++++++++
                     +++++++++******************************+++++++++++++++++++++++++++
 *++++++++++++++++++++++++++++******************************+++++++++++++++++++++++++++
##+++++++++++++++++++++++++++******************************++++++++++++++++++++++++++++
##+++++++++++++++++++++++++++*************###**************++++++++++++++++++++++++++++
 #*++++++++++++++++++++++++++**********##########*********++++++++++++++++++++++++++++
 ##+++++++++++++++++++++++++*********##     ######********++++++++++++++++++++++++++++
 ##*+++++++++++++++**#++++++***************    ####******+++++++++++++++++++++++++++++
  #*++++++++**#######*++++++********************####*****++++++++*****+++++++++++++++
  ##+++++++*#      **+++++++*****************************+++++*#########*++++++++++++
   ##++++++++++++++++++++++*****************************+++++*#     ######*+++++++++
   ##*+++++++++++++++++++++*****************************+++++++++++++  ####*++++++++
    ##+++++++++++++++++++++****************************+++++++++++++++++*###+++++++
     ##++++++++++++++++++++****************************+++++++++++++++++++++++++++
     ###++++++++++++++++**####*********#####**********++++++++++++++++++++++++++++
      ##*++++++++++++++*   ###**********###########***+++++++++++++++++++++++++++
       ###++++++++++++     ###************ ############****+++++++++++++++++++++
        ###++++++++++ ++++++****************      ############***++++++++++++++
          ##*+++++++++++++++******************           #########++++++++++++
           ###+++++++++++++++*********************           #**+++++++++++++
            ####*++++++++++++**********************+++++++++++++++++++++++++
              %###*+++++++++++*********************+++++++++++++++++++++++
                 ####****+++++****#***************+++++++++++++++++++++++
                     ###############**************+++++++++++++++++++++
                                 #####***********+++++++++++++++++++*
                                  #######********++++++++++++++++**#
                                    #########***+++++++++++++***##
                                       ##########*********#####
                                           ################\n
      `);
  log().info(figlet.textSync('FLAKE CHECKER', { font: 'ANSI Shadow', horizontalLayout: 'full' }));
};
