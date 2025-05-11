# Documents List

A modern web application for managing and displaying documents with a clean and intuitive interface.

## Author

**David Canut** - [GitHub](https://github.com/canutdca)

## Requirements

- Node.js (v22.13.0 or higher)
- Have the supplied server running on port 8080 (if you use another port, you can change it in the .env file or in the default values of config/env.ts).

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/documents-list.git
cd documents-list
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a .env file in the root directory of the project and add the following line:

```
API_URL=http://localhost:8080/
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

### Web Components

We've chosen Web Components as our core technology for several reasons:

- **Native Browser Support**: No framework dependencies, resulting in smaller bundle sizes
- **Reusability**: Components can be used across different projects
- **Standards-based**: Built on web standards, ensuring long-term maintainability

### Tailwind CSS

Tailwind CSS was selected for styling because:

- **Utility-first**: Rapid development with pre-built utility classes
- **Customization**: Easy to customize and extend
- **Performance**: Only includes the CSS you use in production
- **Responsive**: Built-in responsive design utilities
- **Modern**: Supports modern features like dark mode and CSS Grid

### TypeScript

TypeScript is used to:

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocompletion and refactoring
- **Documentation**: Types serve as inline documentation
- **Maintainability**: Easier to maintain and refactor code

### Vite

Vite is our build tool because:

- **Speed**: Extremely fast development server
- **Modern**: Built for modern browsers
- **Simple**: Zero configuration needed
- **Optimized**: Production builds are optimized automatically

### Vitest

Vitest is used for unit testing because:

- **Vite Integration**: Native integration with Vite for fast test execution
- **TypeScript Support**: First-class TypeScript support
- **Watch Mode**: Fast and reliable watch mode for development
- **Compatible**: Compatible with Jest's API for easy migration
- **Coverage**: Built-in coverage reporting
- **UI**: Interactive UI for test debugging

### Testing Library

Testing Library is used for component testing because:

- **User-Centric**: Tests from the user's perspective
- **Accessibility**: Encourages accessible component design
- **Maintainable**: Less brittle tests that focus on behavior
- **Simple API**: Easy to use and understand
- **Framework Agnostic**: Works with any framework
- **Best Practices**: Promotes testing best practices

### Playwright

Playwright is used for end-to-end testing because:

- **Cross-browser**: Tests run in Chromium, Firefox, and WebKit
- **Modern**: Built for modern web applications
- **Reliable**: Auto-waiting and auto-retry mechanisms
- **Powerful**: Rich API for complex testing scenarios

### Code Quality Tools

#### ESLint

ESLint is used for code linting because:

- **Code Quality**: Enforces consistent code style
- **Error Prevention**: Catches common programming errors
- **Best Practices**: Enforces coding best practices
- **Customizable**: Highly configurable rules
- **TypeScript Support**: Full TypeScript integration
- **Auto-fix**: Can automatically fix many issues

#### Prettier

Prettier is used for code formatting because:

- **Consistency**: Enforces consistent code style
- **Zero Configuration**: Works out of the box
- **Multi-language**: Supports multiple languages
- **Integration**: Works well with ESLint
- **Format on Save**: Can format code automatically
- **Opinionated**: Reduces style debates

## Features

### Required features

- [x] Display the most recent documents created, as a list view or as a grid view.
- [x] Display a notification to the user (in real time), when a new document is being created by other users.
- [x] Allow the creation of a new document. New documents created by the user should be displayed in the list.
- [x] Sort documents by name, version or creation date.

### Optional features

- [ ] Offline support
- [x] Box notification system
- [x] Relative date formatting (e.g. "1 day ago")

#### Document Management

- View documents in list or card format
- Sort documents by name, version, or creation date
- Add new documents with metadata
- Real-time updates when documents are added

#### User Interface

- Responsive design that works on all devices
- Clean and modern interface using Tailwind CSS
- Accessible components following ARIA standards

#### View Options

- Toggle between list and card views
- List view for detailed information
- Card view for visual browsing
- Persistent view preference

#### Document Form

- Add new documents with required metadata
- Form validation
- Real-time feedback
- Modal dialog for better UX

## Testing

### Unit Tests

Run unit tests with:

```bash
npm test
```

### Unit Test Coverage

Run tests with coverage report:

```bash
npm run test:coverage
```

### End-to-End Tests

Run E2E tests with:

```bash
npm run test:e2e
```

For E2E tests with UI:

```bash
npm run test:e2e:ui
```

For E2E tests in debug mode:

```bash
npm run test:e2e:debug
```

## Pending Features

### High Priority

- Set up GitHub Actions for CI/CD:
  - Run tests and build after each Pull Request
  - Run tests and deploy on merge to main branch
- Implement Husky to run tests before each commit
- Configure lint-staged with Husky to run linting on modified files before each commit
- Ensure 100% test coverage
- More E2E tests

### Medium Priority

- Currently, we pass the props to child components as a JSON string. Instead, we should pass an array of Document objects. Otherwise, we lose the Date object (of Documents)
- Create a custom component library for each UI element: modals, buttons, texts, inputs...
- Improve separation of concerns in the codebase
- Refactor large WebComponents into smaller, more focused components
- Some components use a setter, while others use props. Unify this logic
- CSS animations

### Low Priority

- Dark mode support
- Optimize memory for very large lists

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
