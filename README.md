# How to run?

```bash
npm install
npm run dev
```

## Transaction Management Application

This project is a transaction management application built using React, TypeScript, and Tailwind CSS. It allows users to create, edit, and manage financial transactions within the application.

### File Structure

- `TransactionCreation.tsx`: Component responsible for creating and editing transactions.
- `TransactionGrop.tsx`: Component for grouping transactions and visualizing them using charts.
- `App.tsx`: Main component that integrates all other components and manages the overall state of the application.

### Components

#### TransactionCreation

The `TransactionCreation` component handles the creation and editing of transactions. It includes input fields for transaction details, and it formats the input amount for consistency.

##### Functions

- `formatAmount(amount: string): string`: Formats the amount by replacing commas with periods and removing any non-numeric characters.
- `getRandomColor(): string`: Generates a random color used for categorizing transactions.

##### Props

- `categories`: Array of Category objects used to categorize the transactions.
- `settings`: Application settings that affect transaction creation.
- `onSubmit`: Callback function triggered when a transaction is created or edited.
- `transaction` (Optional): The transaction object being edited.

#### TransactionGrop

The `TransactionGrop` component is responsible for displaying and managing a group of transactions. It integrates a doughnut chart to visually represent transaction categories and totals.

##### State

- `transactions`: Array of Transaction objects representing the transactions in the group.
- `categories`: Array of Category objects used in the doughnut chart.
- `total`: Total amount of all transactions in the group.

##### Functions

- `recalc()`: Recalculates the total of all transactions in the group.

##### Props

- `dataManager`: Instance of DataManager for managing data operations related to transactions.
- `transactionManager`: Instance of TransactionManager for managing transaction operations.
- `categories`: Array of Category objects used in the chart.
- `onEdit`: Function to edit a transaction within the group.

#### App

The `App` component is the main component of the application. It manages the state of the application, including the currently displayed screen and the total amount of transactions.

##### State

- `screen`: The current screen being displayed (e.g., "expenses", "income").
- `total`: The total amount of transactions across all screens.

##### Functions

- `recalc()`: Recalculates the total expenses or income based on the selected screen.
- `setScreen(screen: Mode)`: Sets the current screen to display either expenses or income.

##### Components Used

- `TransactionGrop`: For managing and displaying grouped transactions.
- `TransactionCreation`: For creating or editing transactions.
