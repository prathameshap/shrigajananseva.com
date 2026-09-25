import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button, Card, Container, GoldRule } from "@/components/ui";
import { signInDemo } from "@/lib/portal/actions";
import { getSession } from "@/lib/portal/session";
import { getDictionary, localePath } from "@/lib/i18n";
import { localeStaticParams, resolveLocale } from "@/lib/route";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return { title: dict.portal.signInTitle, robots: { index: false, follow: false } };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const query = await searchParams;

  if (await getSession()) redirect(localePath(locale, "/portal"));

  const hasEmailError = query.error === "email";

  return (
    <Container width="narrow">
      <div className="py-16 sm:py-24">
        <Card className="p-7 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-saffron-600 text-sandal-50">
            <Icon.Lotus className="h-6 w-6" />
          </span>

          <h1 className="mt-6 text-3xl">{dict.portal.signInTitle}</h1>
          <GoldRule className="mt-4 max-w-24" />
          <p className="mt-5 text-muted">{dict.portal.signInIntro}</p>

          <form action={signInDemo} className="mt-7 flex flex-col gap-4">
            <input type="hidden" name="locale" value={locale} />
            <label className="flex flex-col gap-1.5">
              <span className="font-semibold text-heading">{dict.connect.emailLabel}</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={dict.connect.emailPlaceholder}
                aria-invalid={hasEmailError || undefined}
                aria-describedby={hasEmailError ? "email-error" : undefined}
                className="rounded-xl border border-hairline bg-surface px-4 py-3 text-body placeholder:text-ink-400"
              />
            </label>

            {hasEmailError ? (
              <p id="email-error" role="alert" className="text-sm font-semibold text-kumkum-600">
                {dict.connect.invalidEmail}
              </p>
            ) : null}

            <Button type="submit" size="lg">
              <Icon.Mail className="h-5 w-5" />
              {dict.portal.sendLink}
            </Button>
          </form>

          {/* Honest about what this actually is */}
          <div className="mt-8 rounded-card border border-dashed border-gold-400 bg-accent-soft/50 p-5">
            <p className="flex items-start gap-2.5 font-semibold text-heading">
              <Icon.Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              This is a demonstration sign-in
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <p>
                No email will be sent, because no mail provider and no database are connected
                yet. Entering any address opens the portal against a single fictional household
                so that every screen can be reviewed.
              </p>
              <p>
                Nothing you type is stored anywhere beyond a cookie in your own browser, and no
                real devotee record exists behind it.
              </p>
            </div>
          </div>

          <div className="mt-7 border-t border-hairline pt-6">
            <p className="text-sm text-muted">
              Coming with real authentication: emailed magic links, Google sign-in, and
              household-scoped access. See{" "}
              <a
                className="font-semibold text-accent underline underline-offset-2"
                href={localePath(locale, "/portal/about-this-demo")}
              >
                what is and is not built yet
              </a>
              .
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
}
