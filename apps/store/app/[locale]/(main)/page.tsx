import { getTranslations } from '@repo/i18n/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  "use cache";
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Store' });

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
    </div>
  );
}
