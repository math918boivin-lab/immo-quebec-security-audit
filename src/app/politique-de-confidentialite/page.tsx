import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialite — Immo Gestion",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Politique de confidentialite" updated="14 septembre 2026">
      <LegalSection title="1. Portee">
        <p>
          Cette politique explique quelles renseignements personnels Immo Gestion (« nous », « le service »)
          recueille lorsque vous creez un compte et utilisez l&apos;application, comment nous les protegeons, et
          quels droits vous avez a leur egard. Elle s&apos;applique a tous les utilisateurs du service.
        </p>
      </LegalSection>

      <LegalSection title="2. Renseignements que nous recueillons">
        <p>Nous recueillons deux categories de renseignements :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Renseignements de compte</strong> : votre nom, votre adresse courriel et un mot de passe
            (conserve uniquement sous forme hachee, jamais en texte clair).
          </li>
          <li>
            <strong>Donnees que vous saisissez dans l&apos;application</strong> : les renseignements que vous
            entrez vous-meme concernant vos immeubles, unites, locataires (nom, courriel, telephone), baux,
            paiements, demandes de maintenance et billets de blog. Ces donnees appartiennent a votre compte
            et ne sont jamais visibles par un autre utilisateur.
          </li>
        </ul>
        <p>
          Nous ne recueillons pas de donnees de localisation, ne suivons pas votre navigation a des fins
          publicitaires et n&apos;installons aucun temoin (cookie) de suivi tiers. Le seul temoin utilise est un
          identifiant de session technique, necessaire pour vous garder connecte.
        </p>
      </LegalSection>

      <LegalSection title="3. Comment nous utilisons ces renseignements">
        <ul className="list-disc space-y-1 pl-5">
          <li>Vous authentifier et securiser l&apos;acces a votre compte.</li>
          <li>Faire fonctionner les fonctionnalites que vous utilisez (tableau de bord, gestion des baux, etc.).</li>
          <li>Vous contacter au sujet de votre compte si necessaire (ex. probleme de securite).</li>
        </ul>
        <p>
          Nous ne vendons ni ne louons vos renseignements personnels a des tiers, et nous ne les utilisons pas
          a des fins publicitaires.
        </p>
      </LegalSection>

      <LegalSection title="4. Ou et comment vos donnees sont stockees">
        <p>
          Vos donnees sont stockees dans une base de donnees exploitee par le fournisseur d&apos;hebergement du
          service. L&apos;acces aux donnees d&apos;un compte est strictement limite a ce compte : chaque
          enregistrement (immeuble, locataire, bail, paiement, billet de blog, etc.) est rattache a un seul
          compte et n&apos;est ni lisible ni modifiable par un autre utilisateur. Les mots de passe sont haches
          avec bcrypt et les sessions utilisent des jetons aleatoires stockes sous forme hachee.
        </p>
      </LegalSection>

      <LegalSection title="5. Conservation et suppression">
        <p>
          Nous conservons vos renseignements tant que votre compte est actif. Vous pouvez demander la
          suppression complete de votre compte et de toutes les donnees associees en tout temps en nous
          contactant (voir section 8). La suppression est irreversible.
        </p>
      </LegalSection>

      <LegalSection title="6. Vos droits">
        <p>
          Conformement a la Loi sur la protection des renseignements personnels dans le secteur prive
          (Quebec, Loi 25) et, le cas echeant, a la Loi sur la protection des renseignements personnels et les
          documents electroniques (LPRPDE, Canada), vous avez le droit de :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Consulter les renseignements personnels que nous detenons a votre sujet;</li>
          <li>Faire corriger toute information inexacte;</li>
          <li>Demander la suppression de votre compte et de vos donnees;</li>
          <li>Retirer votre consentement en fermant votre compte.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Securite">
        <p>
          Nous appliquons des mesures de securite techniques raisonnables : chiffrement des mots de passe,
          sessions securisees (temoins httpOnly, SameSite), limitation des tentatives de connexion,
          isolation stricte des donnees entre comptes, et en-tetes de securite du navigateur. Aucune methode
          de transmission ou de stockage n&apos;est toutefois garantie a 100 % sure.
        </p>
      </LegalSection>

      <LegalSection title="8. Nous contacter">
        <p>
          Pour toute question concernant cette politique ou pour exercer vos droits, contactez
          l&apos;administrateur du service a l&apos;adresse courriel associee a votre compte, ou via le
          courriel indique lors de votre inscription.
        </p>
      </LegalSection>

      <LegalSection title="9. Modifications">
        <p>
          Nous pouvons mettre a jour cette politique de temps a autre. La date de derniere mise a jour figure
          en haut de cette page. Nous vous encourageons a la consulter periodiquement.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
