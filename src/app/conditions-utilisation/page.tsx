import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Immo Gestion",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Conditions d'utilisation" updated="14 septembre 2026">
      <LegalSection title="1. Acceptation des conditions">
        <p>
          En creant un compte ou en utilisant Immo Gestion (« le service »), vous acceptez d&apos;etre lie par
          les presentes conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne
          pas utiliser le service.
        </p>
      </LegalSection>

      <LegalSection title="2. Description du service">
        <p>
          Immo Gestion est une application de gestion immobiliere permettant de suivre des immeubles, des
          unites, des locataires, des baux, des paiements et des demandes de maintenance, ainsi qu&apos;un
          espace de blog prive par compte. Chaque compte dispose d&apos;un espace de donnees isole et
          confidentiel.
        </p>
      </LegalSection>

      <LegalSection title="3. Votre compte">
        <ul className="list-disc space-y-1 pl-5">
          <li>Vous devez fournir des renseignements exacts lors de la creation de votre compte.</li>
          <li>
            Vous etes responsable de la confidentialite de votre mot de passe et de toute activite effectuee
            depuis votre compte.
          </li>
          <li>Vous devez nous informer sans delai de toute utilisation non autorisee de votre compte.</li>
          <li>Un compte est reserve a un seul utilisateur; le partage de compte n&apos;est pas recommande.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Utilisation acceptable">
        <p>Vous vous engagez a ne pas :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Utiliser le service a des fins illegales ou pour contrevenir aux droits d&apos;un tiers;</li>
          <li>
            Tenter de contourner les mesures de securite, d&apos;acceder a des donnees d&apos;un autre compte,
            ou de perturber le fonctionnement du service;
          </li>
          <li>Televerser du contenu illegal, diffamatoire ou portant atteinte aux droits d&apos;autrui dans le blog ou tout autre champ de l&apos;application;</li>
          <li>Revendre ou redistribuer l&apos;acces au service sans autorisation.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Vos donnees">
        <p>
          Les donnees que vous saisissez (immeubles, locataires, baux, paiements, billets de blog, etc.) vous
          appartiennent. Nous les traitons uniquement pour faire fonctionner le service, conformement a notre{" "}
          <a
            href="/politique-de-confidentialite"
            className="text-slate-900 underline hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded"
          >
            politique de confidentialite
          </a>
          . Vous demeurez seul responsable de l&apos;exactitude des renseignements que vous entrez, notamment
          ceux concernant vos locataires.
        </p>
      </LegalSection>

      <LegalSection title="6. Disponibilite du service">
        <p>
          Nous nous efforcons de maintenir le service disponible et fonctionnel, mais nous ne garantissons pas
          un fonctionnement ininterrompu ou exempt d&apos;erreurs. Des interruptions temporaires peuvent
          survenir pour maintenance ou en raison de circonstances hors de notre controle.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation de responsabilite">
        <p>
          Dans la mesure permise par la loi, le service est fourni « tel quel », sans garantie d&apos;aucune
          sorte. Nous ne pourrons etre tenus responsables des pertes ou dommages indirects decoulant de
          l&apos;utilisation du service, y compris la perte de donnees resultant d&apos;une utilisation
          inappropriee de votre compte.
        </p>
      </LegalSection>

      <LegalSection title="8. Resiliation">
        <p>
          Vous pouvez cesser d&apos;utiliser le service et demander la suppression de votre compte en tout
          temps. Nous nous reservons le droit de suspendre ou de resilier un compte en cas de violation des
          presentes conditions.
        </p>
      </LegalSection>

      <LegalSection title="9. Droit applicable">
        <p>
          Les presentes conditions sont regies par les lois applicables dans la province de Quebec et les lois
          du Canada qui s&apos;y appliquent.
        </p>
      </LegalSection>

      <LegalSection title="10. Modifications">
        <p>
          Nous pouvons modifier ces conditions de temps a autre. La date de derniere mise a jour figure en
          haut de cette page. La poursuite de l&apos;utilisation du service apres une modification vaut
          acceptation des nouvelles conditions.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
