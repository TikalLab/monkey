GitMonkey monitors your repositories and commits for exposed secrets and private keys.

When you integrate with various APIs, such as AWS, PayPal and Twilio, you're given private keys that you use to authenticate against them. You must keep them private, otherwise your account with these API providers can be breached and the result might be devastating.

However, once you or anyone from your team, deliberately or accidentally embeds such a secret or private key in your code, config file, or any other file that is committed into a repository, this key is no longer private and should be revoked.

GitMonkey runs full scan on entire repositories, and hooks to scan each and every push, so you can be immediately alerted if one of your secrets or private keys is exposed in the repository.

features:
  - Scan full repositories.
  - Scan each new push.
  - Approve keys that are OK to be exposed so GitMonkey won't bother you about them again.
