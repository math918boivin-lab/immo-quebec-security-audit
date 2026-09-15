import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de temoins (cookies) — Immo Gestion",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Politique de temoins (cookies)" updated="15 septembre 2026">
      <LegalSection title="1. Ce que nous utilisons">
        <p>
          Immo Gestion utilise <strong>un seul temoin (cookie)</strong>, strictement necessaire au
          fonctionnement du service :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Finalite</th>
                <th className="py-2 pr-4">Duree</th>
                <th className="py-2">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">immo_session</td>
                <td className="py-2 pr-4">Maintenir votre session ouverte et vous garder connecte de facon securisee</td>
                <td className="py-2 pr-4">7 jours (ou jusqu&apos;a la deconnexion)</td>
                <td className="py-2">Strictement necessaire</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Ce temoin est <strong>httpOnly</strong> (inaccessible au code JavaScript, y compris a des scripts
          malveillants), transmis uniquement via une connexion chiffree en production (<strong>Secure</strong>),
          et restreint aux requetes provenant de notre propre site (<strong>SameSite=Lax</strong>). Il ne
          contient aucune donnee personnelle lisible : seul un jeton aleatoire y est stocke, dont la
          correspondance avec votre compte est verifiee cote serveur.
        </p>
      </LegalSection>

      <LegalSection title="2. Ce que nous n'utilisons pas">
        <p>Immo Gestion n&apos;utilise :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Aucun temoin de mesure d&apos;audience ou d&apos;analytique (ex. Google Analytics);</li>
          <li>Aucun temoin publicitaire ou de reciblage (ex. Meta Pixel, Google Ads);</li>
          <li>Aucun temoin de reseau social;</li>
          <li>Aucun temoin tiers d&apos;aucune sorte;</li>
          <li>Aucune technologie de suivi (pixels invisibles, empreinte numerique, stockage local a des fins de suivi).</li>
        </ul>
        <p>
          Les polices de caracteres utilisees par l&apos;application sont integrees directement au site lors
          de sa construction (et non chargees depuis les serveurs de Google a chaque visite), de sorte
          qu&apos;aucune requete n&apos;est envoyee a un tiers lorsque vous consultez le site.
        </p>
      </LegalSection>

      <LegalSection title="3. Pourquoi aucun bandeau de consentement n'est affiche">
        <p>
          En vertu de l&apos;article 8.1 de la Loi sur la protection des renseignements personnels dans le
          secteur prive (Quebec), le consentement prealable n&apos;est pas requis pour une technologie
          « necessaire a la fourniture ou a la livraison d&apos;un produit ou d&apos;un service
          technologique demande par l&apos;utilisateur ». Notre unique temoin sert exclusivement a vous
          garder connecte a votre propre compte : sans lui, le service ne peut tout simplement pas
          fonctionner, et il n&apos;existe aucun temoin optionnel que vous pourriez refuser. C&apos;est
          pourquoi nous ne presentons pas de bandeau « accepter / refuser les temoins » : il n&apos;y a rien
          d&apos;optionnel a accepter ou refuser. Cette politique constitue neanmoins l&apos;information
          transparente exigee par la loi sur l&apos;utilisation de cette technologie.
        </p>
      </LegalSection>

      <LegalSection title="4. Gerer ou supprimer ce temoin">
        <p>
          Vous pouvez supprimer le temoin <span className="font-mono text-xs">immo_session</span> en tout
          temps via les parametres de votre navigateur, ou simplement en vous deconnectant du service. La
          suppression de ce temoin met automatiquement fin a votre session : vous devrez vous reconnecter
          pour continuer a utiliser l&apos;application.
        </p>
      </LegalSection>

      <LegalSection title="5. Modifications">
        <p>
          Si l&apos;usage de temoins evoluait (par exemple l&apos;ajout d&apos;une fonctionnalite
          d&apos;analytique), cette page serait mise a jour au prealable et, le cas echeant, un mecanisme de
          consentement approprie serait mis en place pour tout temoin non essentiel. La date de derniere
          mise a jour figure en haut de cette page.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
