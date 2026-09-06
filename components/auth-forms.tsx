"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { safeNext } from "@/lib/validation";

export function AuthForm({
  next,
  token,
  verified,
}: {
  next: string;
  token?: string;
  verified: boolean;
}) {
  const [mode, setMode] = useState(token ? "reset" : "login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    verified ? "Email verified. You can now sign in." : "",
  );
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") || "");
    const password = String(fields.get("password") || "");
    try {
      if (mode === "login") {
        const r = await authClient.signIn.email({ email, password });
        if (r.error) throw new Error(r.error.message || "Unable to sign in.");
        if (
          r.data &&
          "twoFactorRedirect" in r.data &&
          r.data.twoFactorRedirect
        ) {
          setMode("mfa");
          return;
        }
        window.location.assign(safeNext(next));
      }
      if (mode === "signup") {
        const r = await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(fields.get("name")),
            email,
            password,
            website: String(fields.get("website") || ""),
            callbackURL: "/login?verified=1",
          }),
        });
        if (!r.ok)
          throw new Error(
            (await r.json()).message || "Unable to create account.",
          );
        setMessage(
          "Check your inbox for a verification link before signing in. If you already have an account, sign in or reset your password.",
        );
        setMode("login");
      }
      if (mode === "forgot") {
        const r = await authClient.requestPasswordReset({
          email,
          redirectTo: "/login",
        });
        if (r.error)
          throw new Error(
            "The reset request could not be completed. Try again later.",
          );
        setMessage(
          "If that email has an account, a reset link will be sent. Please check your inbox.",
        );
      }
      if (mode === "reset") {
        const r = await authClient.resetPassword({
          newPassword: password,
          token: token!,
        });
        if (r.error)
          throw new Error(
            "That reset link could not be used. Request a new one.",
          );
        setMode("login");
        setMessage("Password updated. Sign in with your new password.");
        history.replaceState(null, "", "/login");
      }
      if (mode === "mfa") {
        const code = String(fields.get("code"));
        const r = fields.get("backup")
          ? await authClient.twoFactor.verifyBackupCode({ code })
          : await authClient.twoFactor.verifyTotp({ code, trustDevice: false });
        if (r.error)
          throw new Error("That code could not be verified. Try again.");
        window.location.assign(safeNext(next));
      }
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const titles: Record<string, string> = {
    login: "Welcome back.",
    signup: "A little time for you.",
    forgot: "Let’s get you back in.",
    reset: "A fresh start.",
    mfa: "One more step.",
  };
  return (
    <div className="auth-card panel">
      <span className="eyebrow">YOUR MADISON HILL ACCOUNT</span>
      <h1>{titles[mode]}</h1>
      <p>
        {mode === "signup"
          ? "Create an account to book, change, and keep track of your appointments."
          : mode === "mfa"
            ? "Enter a code from your authenticator app, or use a recovery code."
            : "Sign in to manage your appointments."}
      </p>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <>
            <label className="field">
              Your name
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
              />
            </label>
            <label className="trap" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </>
        )}
        {!["reset", "mfa"].includes(mode) && (
          <label className="field">
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
        )}
        {["login", "signup", "reset"].includes(mode) && (
          <label className="field">
            Password
            <input
              name="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={mode === "login" ? 1 : 12}
              maxLength={128}
            />
            {mode !== "login" && (
              <span className="muted">At least 12 characters.</span>
            )}
          </label>
        )}
        {mode === "mfa" && (
          <>
            <label className="field">
              Verification or recovery code
              <input
                name="code"
                autoComplete="one-time-code"
                required
                maxLength={100}
              />
            </label>
            <label className="check">
              <input name="backup" type="checkbox" />
              I’m using a recovery code
            </label>
          </>
        )}
        {mode === "signup" && (
          <label className="check">
            <input type="checkbox" required />{" "}
            <span>
              I agree to the <Link href="/policies">booking policies</Link> and
              have read the <Link href="/privacy">privacy notice</Link>.
            </span>
          </label>
        )}
        <button className="button" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : mode === "forgot"
                ? "Send reset link"
                : mode === "reset"
                  ? "Save password"
                  : mode === "mfa"
                    ? "Verify code"
                    : "Sign in"}
        </button>
      </form>
      <p className="feedback" role="status">
        {message}
      </p>
      <div className="auth-links">
        <button
          className="link-button"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setMessage("");
          }}
        >
          {mode === "signup" ? "Already have an account?" : "Create an account"}
        </button>
        <button
          className="link-button"
          onClick={() => {
            setMode(mode === "forgot" ? "login" : "forgot");
            setMessage("");
          }}
        >
          {mode === "forgot" ? "Back to sign in" : "Forgot password?"}
        </button>
      </div>
    </div>
  );
}
export function SignOut() {
  const router = useRouter();
  return (
    <button
      className="link-button"
      onClick={async () => {
        const result = await authClient.signOut();
        if (!result.error) {
          router.replace("/");
          router.refresh();
        }
      }}
    >
      Sign out
    </button>
  );
}
export function SecurityForm({
  enabled,
  next,
}: {
  enabled: boolean;
  next: string;
}) {
  const [uri, setUri] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(enabled ? "verify" : "enable");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const f = new FormData(e.currentTarget);
    try {
      if (stage === "enable") {
        const r = await authClient.twoFactor.enable({
          password: String(f.get("password")),
        });
        if (r.error) throw new Error(r.error.message);
        if (r.data && "totpURI" in r.data) {
          setUri(r.data.totpURI);
          setCodes(r.data.backupCodes);
          setStage("verify");
        }
      } else {
        const code = String(f.get("code"));
        const r = f.get("backup")
          ? await authClient.twoFactor.verifyBackupCode({ code })
          : await authClient.twoFactor.verifyTotp({ code, trustDevice: false });
        if (r.error) throw new Error("That code could not be verified.");
        window.location.assign(safeNext(next));
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-card panel">
      <span className="eyebrow">ACCOUNT SECURITY</span>
      <h1>{stage === "enable" ? "An extra layer." : "Verify it’s you."}</h1>
      <p>
        Staff access requires an authenticator app. Keep your recovery codes
        somewhere private.
      </p>
      {uri && (
        <div>
          <p className="muted">
            Add a time-based account in your authenticator app using this setup
            key:
          </p>
          <code className="inline-code">
            {new URL(uri).searchParams.get("secret")}
          </code>
          <div className="recovery">
            <strong>Save these recovery codes before continuing:</strong>
            {codes.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
        </div>
      )}
      <form onSubmit={submit}>
        {stage === "enable" ? (
          <label className="field">
            Current password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
        ) : (
          <>
            <label className="field">
              Authenticator or recovery code
              <input name="code" autoComplete="one-time-code" required />
            </label>
            {!uri && (
              <label className="check">
                <input name="backup" type="checkbox" />
                Use a recovery code
              </label>
            )}
            {uri && (
              <label className="check">
                <input type="checkbox" required />I saved my recovery codes
                privately.
              </label>
            )}
          </>
        )}
        <button className="button" disabled={busy}>
          {busy
            ? "Please wait…"
            : stage === "enable"
              ? "Set up authenticator"
              : "Verify and continue"}
        </button>
      </form>
      <p role="status" className="feedback">
        {message}
      </p>
    </div>
  );
}
