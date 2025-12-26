# Page Layout & Header Standards

To ensure a consistent, premium, and fluid user experience across the Admin Dashboard, all pages **MUST** adhere to the following strict layout guidelines.

## 1. The Golden Layout Structure

Every page (`page.tsx`) must follow this exact DOM structure. Do not deviate.

```tsx
export default function StandardPage() {
  return (
    // 1. Root Wrapper: Flex Column, Full Width, Min Screen Height
    <div className="flex flex-col w-full min-h-screen pb-20">

      {/* 2. The Header: Sits at the top, NOT inside the content padding */}
      <PageHeader title="Title" ... />

      {/* 3. The Content: Fluid width with standardized padding */}
      <div className="w-full px-6 lg:px-10 py-8">
        {/* Your Page Content Components */}
      </div>

    </div>
  )
}
```

## 2. Header Selection Guide

Use **only** these V2 headers. Do not create custom headers or wrappers.

| Page Scenario         | Component to Use | Import Path                                    | Features                                                          |
| :-------------------- | :--------------- | :--------------------------------------------- | :---------------------------------------------------------------- |
| **Dashboard / Lists** | `PageHeader`     | `@/components/layout/headers/v2/header-page`   | Large title, description, generic actions. Non-sticky.            |
| **Detail View**       | `DetailHeader`   | `@/components/layout/headers/v2/header-detail` | **Sticky**. Back button, Title + #ID Badge, Action buttons.       |
| **Forms / Editing**   | `FormHeader`     | `@/components/layout/headers/v2/header-form`   | **Sticky**. Back button, Title + Description, Save/Discard logic. |

## 3. Critical "Do Nots" (Strictly Forbidden) ⛔

- ❌ **NO `max-w-7xl mx-auto`**: We have moved to a **Fluid Layout**. Do not constrain the page width.
- ❌ **NO Custom Header Wrappers**: Do not create files like `ProductPageHeader.tsx`. Import and use the core Headers directly in your container or page.
- ❌ **NO Custom Padding on Headers**: The V2 headers already have the correct `px-6 lg:px-10` padding. Adding more will break alignment.
- ❌ **NO Wrappers in `page.tsx`**: Do not wrap your main component (e.g., `<ProductDetails />`) in a styled `div` inside `page.tsx`. Pass the Layout responsibility to the component itself or follow the "Golden Layout" exactly.

## 4. Component Best Practices

- **Inlining Actions**: Pass Dialogs, Sheets, and Buttons directly to the `actions` prop of the Header.
- **Skeleton Exports**: Every complex page component (e.g., `ProductDetails`) must export a corresponding `...Skeleton` component for `Suspense` fallbacks.
