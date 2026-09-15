import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de remboursement — Immo Gestion",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Politique de remboursement" updated="14 septembre 2026">
      <LegalSection title="1. Service actuellement gratuit">
        <p>
          Immo Gestion est actuellement offert gratuitement : la creation d&apos;un compte et
          l&apos;utilisation de toutes les fonctionnalites (immeubles, locataires, baux, paiements,
          maintenance, blog) ne comportent aucuns frais. Aucun paiement n&apos;est donc traite par le
          service pour le moment, et cette politique ne s&apos;applique a aucune transaction en cours.
        </p>
      </LegalSection>

      <LegalSection title="2. Si des offres payantes sont introduites">
        <p>
          Advenant l&apos;introduction future d&apos;offres payantes (par exemple un abonnement mensuel ou
          annuel), les principes suivants s&apos;appliqueraient, sous reserve des conditions specifiques
          communiquees au moment de l&apos;achat :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Periode d&apos;essai / satisfaction garantie</strong> : un remboursement complet pourrait
            etre demande dans les 14 jours suivant un premier paiement, sans justification requise.
          </li>
          <li>
            <strong>Abonnements recurrents</strong> : l&apos;annulation d&apos;un abonnement empeche tout
            renouvellement futur, mais ne donne pas droit a un remboursement prorata de la periode deja
            entamee, sauf erreur de facturation de notre part.
          </li>
          <li>
            <strong>Erreur de facturation</strong> : tout montant preleve par erreur (double facturation,
            montant incorrect) serait rembourse integralement des sa detection.
          </li>
          <li>
            <strong>Delai de traitement</strong> : un remboursement approuve serait traite dans un delai de
            10 jours ouvrables vers le mode de paiement original.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Comment demander un remboursement">
        <p>
          Si cette politique venait a s&apos;appliquer, toute demande devrait etre adressee a
          l&apos;administrateur du service, en precisant votre compte et la date de la transaction
          concernee.
        </p>
      </LegalSection>

      <LegalSection title="4. Modifications">
        <p>
          Cette politique sera mise a jour si des offres payantes sont introduites. La date de derniere mise
          a jour figure en haut de cette page.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
