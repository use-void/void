import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
import { getTranslations } from "@repo/i18n";
import { Copyright } from "./copyright";

export async function SiteFooter({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store" });

    return (
        <footer className="bg-card border-t py-16 w-full mt-auto">
            <div className="container mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-foreground">
                            <ShoppingBag className="h-8 w-8 text-primary" />
                            <span>Store</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            {t("description")}
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t("footer.shop")}</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">{t("common.products")}</Link></li>
                            <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">{t("common.categories")}</Link></li>
                            <li><Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors">{t("common.collections")}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t("footer.support")}</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.aboutUs")}</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.contactUs")}</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.faq")}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t("footer.contactUs")}</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-muted-foreground">123 Street Name, City, Country</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-muted-foreground">+1 234 567 890</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-muted-foreground">support@store.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
                    <Copyright />
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="hover:text-primary transition-colors">{t("footer.privacyPolicy")}</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">{t("footer.termsOfService")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
