// Translation keys and text for PT-BR and EN-US
export const translations = {
    'pt-BR': {
        // Navigation
        'nav.home': 'Início',
        'nav.incomes': 'Receitas',
        'nav.expenses': 'Despesas',
        'nav.about': 'Sobre',

        // Menu
        'menu.settings': 'Configurações',

        // Authentication
        'auth.welcome': 'Bem-vindo ao Turtle Finance',
        'auth.description': 'Seu rastreador de finanças pessoais sincronizado diretamente com o Google Sheets. Faça login para começar.',
        'auth.signIn': 'Entrar com Google',
        'auth.signOut': 'Sair',

        // Dashboard
        'dashboard.title': 'Painel',
        'dashboard.welcomeBack': 'Bem-vindo de volta',
        'dashboard.totalIncome': 'Receita Total',
        'dashboard.totalExpenses': 'Despesa Total',
        'dashboard.balance': 'Saldo',
        'dashboard.recentTransactions': 'Transações Recentes',
        'dashboard.noTransactions': 'Nenhuma transação encontrada.',
        'dashboard.refreshData': 'Atualizar Dados',

        // Connect Sheet
        'connect.title': 'Conecte sua Planilha',
        'connect.description': 'Por favor, insira o ID da sua Planilha Google. Você pode encontrar isso na URL:',
        'connect.placeholder': 'Insira o ID da Planilha',
        'connect.button': 'Conectar',

        // Incomes Page
        'incomes.title': 'Receitas',
        'incomes.addButton': 'Adicionar Receita',
        'incomes.cancelButton': 'Cancelar',
        'incomes.formTitle': 'Adicionar Nova Receita',
        'incomes.saveButton': 'Salvar Receita',
        'incomes.savingButton': 'Salvando...',

        // Expenses Page
        'expenses.title': 'Despesas',
        'expenses.addButton': 'Adicionar Despesa',
        'expenses.cancelButton': 'Cancelar',
        'expenses.formTitle': 'Adicionar Nova Transação',
        'expenses.saveButton': 'Salvar Transação',
        'expenses.savingButton': 'Salvando...',

        // Form Labels
        'form.date': 'Data',
        'form.type': 'Tipo',
        'form.description': 'Descrição',
        'form.amount': 'Valor',
        'form.category': 'Categoria',
        'form.descriptionPlaceholder': 'ex: Compras no Mercado',
        'form.categoryPlaceholder': 'ex: Alimentação, Transporte',
        'form.method': 'Método de Pagamento',
        'form.creditCard': 'Cartão de Crédito',
        'form.selectCreditCard': 'Selecionar Cartão',
        'form.bankAccount': 'Conta Bancária',
        'form.selectBankAccount': 'Selecionar Conta',

        // Payment Methods
        'method.cash': 'Dinheiro',
        'method.credit': 'Crédito',
        'method.pix': 'PIX',
        'method.debit': 'Débito',

        // Transaction Types
        'type.expense': 'Despesa',
        'type.income': 'Receita',

        // Table Headers
        'table.date': 'Data',
        'table.description': 'Descrição',
        'table.category': 'Categoria',
        'table.amount': 'Valor',
        'table.type': 'Tipo',
        'table.method': 'Método',
        'table.bankAccount': 'Conta Bancária',

        // Expenses
        'expenses.filterByCreditCard': 'Filtrar por Cartão de Crédito',
        'expenses.allExpenses': 'Todas as Despesas',
        'expenses.results': 'resultados',

        // Settings
        'settings.title': 'Configurações',
        'settings.spreadsheetId': 'ID da Planilha de Despesas',
        'settings.incomeSheetId': 'ID da Planilha de Receitas',
        'settings.save': 'Salvar',
        'settings.saved': 'Salvo!',
        'settings.disconnect': 'Desconectar Planilha',
        'settings.categories': 'Categorias',
        'settings.incomeCategories': 'Categorias de Receitas',
        'settings.expenseCategories': 'Categorias de Despesas',
        'settings.addCategory': 'Adicionar Categoria',
        'settings.newCategoryPlaceholder': 'Nova categoria...',
        'settings.theme': 'Tema',
        'settings.region': 'Idioma',
        'settings.currency': 'Moeda',
        'settings.layout': 'Layout',
        'settings.mobileLayout': 'Mobile',
        'settings.repairSheets': 'Reparar Planilhas',
        'settings.bankAccounts': 'Contas Bancárias',
        'settings.creditCards': 'Cartões de Crédito',
        'settings.addBankAccount': 'Adicionar Conta',
        'settings.addAccount': 'Adicionar Conta',
        'settings.addCreditCard': 'Adicionar Cartão',
        'settings.accountName': 'Nome da Conta',
        'settings.bankName': 'Nome do Banco',
        'settings.accountType': 'Tipo de Conta',
        'settings.agency': 'Agência',
        'settings.accountNumber': 'Número da Conta',
        'settings.initialBalance': 'Saldo Inicial (Opcional)',
        'settings.cardName': 'Nome do Cartão',
        'settings.cardNamePlaceholder': 'ex: Visa Gold',
        'settings.lastFourDigits': 'Últimos 4 Dígitos (Opcional)',
        'settings.linkedAccount': 'Conta Vinculada',
        'settings.expenseSheet': 'Planilha de Despesas',
        'settings.expenseSheetDesc': 'Gerencie a conexão com sua planilha de despesas',
        'settings.incomeSheet': 'Planilha de Receitas',
        'settings.incomeSheetDesc': 'Gerencie a conexão com sua planilha de receitas',
        'settings.repairStructure': 'Reparar Estrutura',
        'settings.sheetId': 'ID da Planilha',
        'settings.regionalSettings': 'Configurações Regionais',
        'settings.regionalSettingsDesc': 'Personalize sua experiência de acordo com sua região',
        'settings.selectBank': 'Selecione um Banco',
        'settings.linkBankAccount': 'Vincular Conta Bancária',
        'settings.addCard': 'Adicionar Cartão',
        'settings.last4': 'Últimos 4 dígitos',
        'settings.newCategory': 'Nova Categoria',
        'settings.incomeCategoriesDesc': 'Gerencie categorias para suas receitas',
        'settings.expenseCategoriesDesc': 'Gerencie categorias para suas despesas',

        // Settings Sections
        'settings.section.spreadsheets': 'Integração de Planilhas',
        'settings.section.spreadsheetsDesc': 'Configure suas conexões com o Google Sheets',
        'settings.section.accounts': 'Contas Financeiras',
        'settings.section.accountsDesc': 'Gerencie suas contas bancárias e cartões',
        'settings.section.categories': 'Categorias',
        'settings.section.categoriesDesc': 'Personalize suas categorias de receitas e despesas',
        'settings.section.preferences': 'Preferências',
        'settings.section.preferencesDesc': 'Ajuste suas preferências regionais e de moeda',

        // Settings Help Text
        'settings.spreadsheet.help': 'Cole o ID da sua planilha do Google Sheets aqui',
        'settings.spreadsheet.repairHelp': 'Se os cabeçalhos da planilha estiverem faltando ou incorretos, use isto para repará-los',
        'settings.accounts.bankRequired': 'Por favor, adicione uma conta bancária antes de registrar cartões de crédito',
        'settings.accounts.noBanks': 'Nenhuma conta bancária registrada',

        // Settings Placeholders
        'settings.spreadsheet.placeholder': 'Cole o ID da planilha aqui',
        'settings.account.namePlaceholder': 'Conta Corrente, Poupança...',
        'settings.account.bankPlaceholder': 'Nubank, Itaú, Bradesco...',

        // First-Time Setup Wizard
        'wizard.welcome.title': 'Bem-vindo ao Turtle Finance! 🐢',
        'wizard.welcome.subtitle': 'Vamos configurar sua conta em poucos passos',
        'wizard.welcome.description': 'Este assistente irá guiá-lo pela configuração inicial. Você pode pular qualquer etapa e configurá-la depois.',

        'wizard.step.welcome': 'Boas-vindas',
        'wizard.step.spreadsheet': 'Planilhas',
        'wizard.step.account': 'Conta Bancária',
        'wizard.step.categories': 'Categorias',
        'wizard.step.complete': 'Concluído',

        'wizard.spreadsheet.title': 'Conecte suas Planilhas',
        'wizard.spreadsheet.description': 'Conecte ao Google Sheets para sincronizar suas despesas e receitas',
        'wizard.spreadsheet.skip': 'Você pode fazer isso depois nas Configurações',

        'wizard.account.title': 'Adicione uma Conta Bancária',
        'wizard.account.description': 'Adicione sua primeira conta bancária para rastrear transações',
        'wizard.account.skip': 'Você pode adicionar contas depois',

        'wizard.categories.title': 'Configure Categorias',
        'wizard.categories.description': 'Personalize as categorias de despesas e receitas',
        'wizard.categories.skip': 'Categorias padrão já estão configuradas',

        'wizard.complete.title': 'Tudo Pronto! 🎉',
        'wizard.complete.description': 'Sua conta está configurada e pronta para uso',
        'wizard.complete.cta': 'Começar a Usar',

        'wizard.button.next': 'Próximo',
        'wizard.button.back': 'Voltar',
        'wizard.button.skip': 'Pular',
        'wizard.button.finish': 'Concluir',

        // Theme Options
        'theme.light': 'Claro',
        'theme.dark': 'Escuro',
        'theme.system': 'Sistema',

        // Region Options
        'region.brazil': 'Português',
        'region.unitedStates': 'Inglês',

        // Currency Options
        'currency.brl': 'Real Brasileiro',
        'currency.usd': 'Dólar Americano',

        // Layout Options
        'layout.sidebar': 'Barra Lateral',
        'layout.header': 'Cabeçalho',
        'layout.drawer': 'Gaveta',
        'layout.bottom': 'Inferior',

        // Filtering and Display
        'expenses.filterByCard': 'Filtrar por Cartão',
        'expenses.allCards': 'Todos os Cartões',
        'expenses.noCreditCards': 'Nenhum cartão registrado',
        'expenses.noExpensesWithCard': 'Nenhuma despesa com cartão de crédito',

        // About Page
        'about.title': 'Sobre',
        'about.description': 'Turtle Finance é um aplicativo de gerenciamento de finanças pessoais.',
        'about.content': 'Esta é a página sobre. Nós amamos tartarugas!',

        // Error Boundary
        'error.title': 'Algo deu errado',
        'error.pageTitle': 'Ops! Erro na Página',
        'error.unknown': 'Ocorreu um erro inesperado',
        'error.reloadButton': 'Recarregar Página',
        'error.tryAgainButton': 'Tentar Novamente',
        'error.goHomeButton': 'Ir para Início',
        'error.details': 'Detalhes do Erro',

        // Google Sheets Errors
        'sheets.error.initFailed': 'Falha ao inicializar a API do Google',
        'sheets.error.fetchFailed': 'Falha ao buscar despesas da planilha',
        'sheets.error.addFailed': 'Falha ao adicionar despesa à planilha',
        'sheets.error.notSignedIn': 'Você precisa fazer login primeiro',
        'sheets.error.noSpreadsheet': 'Nenhuma planilha configurada',
        'sheets.error.noSpreadsheetId': 'Nenhum ID de planilha definido',
        'sheets.error.permissionDenied': 'Permissão negada. Por favor, saia e entre novamente.',
        'sheets.error.tokenExpired': 'Sua sessão expirou. Por favor, entre novamente.',
        'sheets.error.invalidSheet': 'A planilha não possui uma aba chamada "Sheet1". Por favor, certifique-se de que a planilha tem uma aba nomeada "Sheet1".',
        'sheets.error.deleteFailed': 'Falha ao excluir item da planilha',
        'sheets.error.unknown': 'Ocorreu um erro desconhecido',

        // Protected Route
        'protected.signInRequired': 'Login Necessário',
        'protected.signInMessage': 'Você precisa estar logado para acessar este recurso. Por favor, faça login com sua conta Google para continuar.',
        'protected.signInButton': 'Entrar com Google',
        // General
        'general.loading': 'Carregando...',
        'common.confirmDelete': 'Tem certeza que deseja excluir este item?',
        'common.delete': 'Excluir',
        'common.optional': 'Opcional',
        'common.menu': 'Menu',
        'common.add': 'Adicionar',
        'common.connected': 'Conectado',
        'common.disconnected': 'Desconectado',
        'common.save': 'Salvar',
        'common.disconnect': 'Desconectar',

        // Default Categories
        'category.income.salary': 'Salário',
        'category.income.freelance': 'Freelance',
        'category.income.investments': 'Investimentos',
        'category.income.gifts': 'Presentes',
        'category.income.other': 'Outros',
        'category.expense.food': 'Alimentação',
        'category.expense.transport': 'Transporte',
        'category.expense.housing': 'Moradia',
        'category.expense.entertainment': 'Entretenimento',
        'category.expense.healthcare': 'Saúde',
        'category.expense.other': 'Outros',

        // First Login Modal
        'firstLogin.welcome': 'Bem-vindo ao Turtle Finance',
        'firstLogin.message': 'Por favor, configure suas preferências para começar.',
        'firstLogin.continue': 'Continuar',
        'firstLogin.sheetSetup': 'Configuração da Planilha',
        'firstLogin.sheetSetupMessage': 'Como você gostaria de configurar suas planilhas?',
        'firstLogin.createNew': 'Criar Nova Planilha',
        'firstLogin.createNewDesc': 'Criar automaticamente uma nova Planilha Google',
        'firstLogin.useExisting': 'Usar Planilha Existente',
        'firstLogin.useExistingDesc': 'Conectar a uma planilha que você já possui',
        'firstLogin.sameSheet': 'Usar a mesma planilha para Receitas e Despesas',
        'firstLogin.separateSheets': 'Usar planilhas separadas',
        'firstLogin.expenseSheetId': 'ID da Planilha de Despesas',
        'firstLogin.incomeSheetId': 'ID da Planilha de Receitas',
        'firstLogin.sheetIdPlaceholder': 'Cole o ID da planilha aqui',
        'firstLogin.finish': 'Finalizar',
        'firstLogin.back': 'Voltar',

        // Sheet Headers (for Google Sheets)
        'sheet.header.id': 'ID',
        'sheet.header.date': 'Data',
        'sheet.header.description': 'Descrição',
        'sheet.header.amount': 'Valor',
        'sheet.header.type': 'Tipo',
        'sheet.header.category': 'Categoria',
        'sheet.header.method': 'Método',
        'sheet.header.creditCardId': 'ID do Cartão',
        'sheet.header.bankAccountId': 'ID da Conta',

        // Sheet Names
        'sheet.name.expenses': 'Despesas',
        'sheet.name.incomes': 'Receitas',

        // Account Types
        'accountType.checking': 'Corrente',
        'accountType.savings': 'Poupança',
    },
    'en-US': {
        // Navigation
        'nav.home': 'Home',
        'nav.incomes': 'Incomes',
        'nav.expenses': 'Expenses',
        'nav.about': 'About',

        // Menu
        'menu.settings': 'Settings',

        // Authentication
        'auth.welcome': 'Welcome to Turtle Finance',
        'auth.description': 'Your personal finance tracker synced directly with Google Sheets. Sign in to get started.',
        'auth.signIn': 'Sign in with Google',
        'auth.signOut': 'Sign Out',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.welcomeBack': 'Welcome back',
        'dashboard.totalIncome': 'Total Income',
        'dashboard.totalExpenses': 'Total Expenses',
        'dashboard.balance': 'Balance',
        'dashboard.recentTransactions': 'Recent Transactions',
        'dashboard.noTransactions': 'No transactions found.',
        'dashboard.refreshData': 'Refresh Data',

        // Connect Sheet
        'connect.title': 'Connect your Sheet',
        'connect.description': 'Please enter the ID of your Google Sheet. You can find this in the URL:',
        'connect.placeholder': 'Enter Spreadsheet ID',
        'connect.button': 'Connect',

        // Incomes Page
        'incomes.title': 'Incomes',
        'incomes.addButton': 'Add Income',
        'incomes.cancelButton': 'Cancel',
        'incomes.formTitle': 'Add New Income',
        'incomes.saveButton': 'Save Income',
        'incomes.savingButton': 'Saving...',

        // Expenses Page
        'expenses.title': 'Expenses',
        'expenses.addButton': 'Add Expense',
        'expenses.cancelButton': 'Cancel',
        'expenses.formTitle': 'Add New Transaction',
        'expenses.saveButton': 'Save Transaction',
        'expenses.savingButton': 'Saving...',

        // Form Labels
        'form.date': 'Date',
        'form.type': 'Type',
        'form.description': 'Description',
        'form.amount': 'Amount',
        'form.category': 'Category',
        'form.descriptionPlaceholder': 'e.g., Grocery Shopping',
        'form.categoryPlaceholder': 'e.g., Food, Transport',
        'form.method': 'Payment Method',
        'form.creditCard': 'Credit Card',
        'form.selectCreditCard': 'Select Credit Card',
        'form.bankAccount': 'Bank Account',
        'form.selectBankAccount': 'Select Bank Account',

        // Payment Methods
        'method.cash': 'Cash',
        'method.credit': 'Credit',
        'method.pix': 'PIX',
        'method.debit': 'Debit',

        // Transaction Types
        'type.expense': 'Expense',
        'type.income': 'Income',

        // Table Headers
        'table.date': 'Date',
        'table.description': 'Description',
        'table.category': 'Category',
        'table.amount': 'Amount',
        'table.type': 'Type',
        'table.method': 'Method',
        'table.bankAccount': 'Bank Account',

        // Expenses
        'expenses.filterByCreditCard': 'Filter by Credit Card',
        'expenses.allExpenses': 'All Expenses',
        'expenses.results': 'results',

        // Settings
        'settings.title': 'Settings',
        'settings.spreadsheetId': 'Expenses Spreadsheet ID',
        'settings.incomeSheetId': 'Income Spreadsheet ID',
        'settings.save': 'Save',
        'settings.saved': 'Saved!',
        'settings.disconnect': 'Disconnect Sheet',
        'settings.categories': 'Categories',
        'settings.incomeCategories': 'Income Categories',
        'settings.expenseCategories': 'Expense Categories',
        'settings.addCategory': 'Add Category',
        'settings.newCategoryPlaceholder': 'New category...',
        'settings.theme': 'Theme',
        'settings.region': 'Language',
        'settings.currency': 'Currency',
        'settings.layout': 'Layout',
        'settings.mobileLayout': 'Mobile',
        'settings.repairSheets': 'Repair Sheets',
        'settings.bankAccounts': 'Bank Accounts',
        'settings.creditCards': 'Credit Cards',
        'settings.addBankAccount': 'Add Bank Account',
        'settings.addAccount': 'Add Account',
        'settings.addCreditCard': 'Add Credit Card',
        'settings.accountName': 'Account Name',
        'settings.bankName': 'Bank Name',
        'settings.accountType': 'Account Type',
        'settings.agency': 'Agency',
        'settings.accountNumber': 'Account Number',
        'settings.initialBalance': 'Initial Balance (Optional)',
        'settings.cardName': 'Card Name',
        'settings.cardNamePlaceholder': 'e.g., Visa Gold',
        'settings.lastFourDigits': 'Last 4 Digits (Optional)',
        'settings.linkedAccount': 'Linked Account',
        'settings.expenseSheet': 'Expense Sheet',
        'settings.expenseSheetDesc': 'Manage connection to your expense sheet',
        'settings.incomeSheet': 'Income Sheet',
        'settings.incomeSheetDesc': 'Manage connection to your income sheet',
        'settings.repairStructure': 'Repair Structure',
        'settings.sheetId': 'Sheet ID',
        'settings.regionalSettings': 'Regional Settings',
        'settings.regionalSettingsDesc': 'Customize your experience based on your region',
        'settings.selectBank': 'Select a Bank',
        'settings.linkBankAccount': 'Link Bank Account',
        'settings.addCard': 'Add Card',
        'settings.last4': 'Last 4 digits',
        'settings.newCategory': 'New Category',
        'settings.incomeCategoriesDesc': 'Manage categories for your income',
        'settings.expenseCategoriesDesc': 'Manage categories for your expenses',

        // Settings Sections
        'settings.section.spreadsheets': 'Spreadsheet Integration',
        'settings.section.spreadsheetsDesc': 'Configure your Google Sheets connections',
        'settings.section.accounts': 'Financial Accounts',
        'settings.section.accountsDesc': 'Manage your bank accounts and credit cards',
        'settings.section.categories': 'Categories',
        'settings.section.categoriesDesc': 'Customize your income and expense categories',
        'settings.section.preferences': 'Preferences',
        'settings.section.preferencesDesc': 'Adjust your regional and currency preferences',

        // Settings Help Text
        'settings.spreadsheet.help': 'Paste your Google Sheets spreadsheet ID here',
        'settings.spreadsheet.repairHelp': 'If your spreadsheet headers are missing or incorrect, use this to repair them',
        'settings.accounts.bankRequired': 'Please add a bank account first before registering credit cards',
        'settings.accounts.noBanks': 'No bank accounts registered',

        // Settings Placeholders
        'settings.spreadsheet.placeholder': 'Paste spreadsheet ID here',
        'settings.account.namePlaceholder': 'Main Checking, Savings...',
        'settings.account.bankPlaceholder': 'Chase, Bank of America...',

        // First-Time Setup Wizard
        'wizard.welcome.title': 'Welcome to Turtle Finance! 🐢',
        'wizard.welcome.subtitle': 'Let\'s set up your account in a few steps',
        'wizard.welcome.description': 'This wizard will guide you through the initial setup. You can skip any step and configure it later.',

        'wizard.step.welcome': 'Welcome',
        'wizard.step.spreadsheet': 'Spreadsheets',
        'wizard.step.account': 'Bank Account',
        'wizard.step.categories': 'Categories',
        'wizard.step.complete': 'Complete',

        'wizard.spreadsheet.title': 'Connect Your Spreadsheets',
        'wizard.spreadsheet.description': 'Connect to Google Sheets to sync your expenses and income',
        'wizard.spreadsheet.skip': 'You can do this later in Settings',

        'wizard.account.title': 'Add a Bank Account',
        'wizard.account.description': 'Add your first bank account to track transactions',
        'wizard.account.skip': 'You can add accounts later',

        'wizard.categories.title': 'Set Up Categories',
        'wizard.categories.description': 'Customize your expense and income categories',
        'wizard.categories.skip': 'Default categories are already set up',

        'wizard.complete.title': 'All Set! 🎉',
        'wizard.complete.description': 'Your account is configured and ready to use',
        'wizard.complete.cta': 'Get Started',

        'wizard.button.next': 'Next',
        'wizard.button.back': 'Back',
        'wizard.button.skip': 'Skip',
        'wizard.button.finish': 'Finish',

        // Theme Options
        'theme.light': 'Light',
        'theme.dark': 'Dark',
        'theme.system': 'System',

        // Region Options
        'region.brazil': 'Portuguese',
        'region.unitedStates': 'English',

        // Currency Options
        'currency.brl': 'Brazilian Real',
        'currency.usd': 'US Dollar',

        // Layout Options
        'layout.sidebar': 'Sidebar',
        'layout.header': 'Header',
        'layout.drawer': 'Drawer',
        'layout.bottom': 'Bottom',

        // Filtering and Display
        'expenses.filterByCard': 'Filter by Credit Card',
        'expenses.allCards': 'All Cards',
        'expenses.noCreditCards': 'No credit cards registered',
        'expenses.noExpensesWithCard': 'No expenses with credit card',

        // About Page
        'about.title': 'About',
        'about.description': 'Turtle Finance is a personal finance management application.',
        'about.content': 'This is the about page. We love turtles!',

        // Error Boundary
        'error.title': 'Something went wrong',
        'error.pageTitle': 'Oops! Page Error',
        'error.unknown': 'An unexpected error occurred',
        'error.reloadButton': 'Reload Page',
        'error.tryAgainButton': 'Try Again',
        'error.goHomeButton': 'Go Home',
        'error.details': 'Error Details',

        // Google Sheets Errors
        'sheets.error.initFailed': 'Failed to initialize Google API',
        'sheets.error.fetchFailed': 'Failed to fetch expenses from spreadsheet',
        'sheets.error.addFailed': 'Failed to add expense to spreadsheet',
        'sheets.error.notSignedIn': 'You need to sign in first',
        'sheets.error.noSpreadsheet': 'No spreadsheet configured',
        'sheets.error.noSpreadsheetId': 'No Spreadsheet ID set',
        'sheets.error.permissionDenied': 'Permission denied. Please sign out and sign in again.',
        'sheets.error.tokenExpired': 'Your session has expired. Please sign in again.',
        'sheets.error.invalidSheet': 'The spreadsheet does not have a sheet named "Sheet1". Please make sure the spreadsheet has a sheet named "Sheet1".',
        'sheets.error.deleteFailed': 'Failed to delete item from spreadsheet',
        'sheets.error.unknown': 'An unknown error occurred',

        // Protected Route
        'protected.signInRequired': 'Sign In Required',
        'protected.signInMessage': 'You need to be logged in to access this feature. Please sign in with your Google account to continue.',
        'protected.signInButton': 'Sign in with Google',

        // General
        'general.loading': 'Loading...',
        'common.confirmDelete': 'Are you sure you want to delete this item?',
        'common.delete': 'Delete',
        'common.optional': 'Optional',
        'common.menu': 'Menu',
        'common.add': 'Add',
        'common.connected': 'Connected',
        'common.disconnected': 'Disconnected',
        'common.save': 'Save',
        'common.disconnect': 'Disconnect',

        // Default Categories
        'category.income.salary': 'Salary',
        'category.income.freelance': 'Freelance',
        'category.income.investments': 'Investments',
        'category.income.gifts': 'Gifts',
        'category.income.other': 'Other',
        'category.expense.food': 'Food',
        'category.expense.transport': 'Transport',
        'category.expense.housing': 'Housing',
        'category.expense.entertainment': 'Entertainment',
        'category.expense.healthcare': 'Healthcare',
        'category.expense.other': 'Other',

        // First Login Modal
        'firstLogin.welcome': 'Welcome to Turtle Finance',
        'firstLogin.message': 'Please configure your preferences to get started.',
        'firstLogin.continue': 'Continue',
        'firstLogin.sheetSetup': 'Sheet Setup',
        'firstLogin.sheetSetupMessage': 'How would you like to set up your spreadsheets?',
        'firstLogin.createNew': 'Create New Sheet',
        'firstLogin.createNewDesc': 'Automatically create a new Google Sheet',
        'firstLogin.useExisting': 'Use Existing Sheet',
        'firstLogin.useExistingDesc': 'Connect to a sheet you already have',
        'firstLogin.sameSheet': 'Use the same sheet for Incomes and Expenses',
        'firstLogin.separateSheets': 'Use separate sheets',
        'firstLogin.expenseSheetId': 'Expense Sheet ID',
        'firstLogin.incomeSheetId': 'Income Sheet ID',
        'firstLogin.sheetIdPlaceholder': 'Paste your sheet ID here',
        'firstLogin.finish': 'Finish',
        'firstLogin.back': 'Back',

        // Sheet Headers (for Google Sheets)
        'sheet.header.id': 'ID',
        'sheet.header.date': 'Date',
        'sheet.header.description': 'Description',
        'sheet.header.amount': 'Amount',
        'sheet.header.type': 'Type',
        'sheet.header.category': 'Category',
        'sheet.header.method': 'Method',
        'sheet.header.creditCardId': 'Credit Card ID',
        'sheet.header.bankAccountId': 'Bank Account ID',

        // Sheet Names
        'sheet.name.expenses': 'Expenses',
        'sheet.name.incomes': 'Incomes',

        // Account Types
        'accountType.checking': 'Checking',
        'accountType.savings': 'Savings',
    }
};

export type TranslationKey = keyof typeof translations['en-US'];
export type Locale = keyof typeof translations;
