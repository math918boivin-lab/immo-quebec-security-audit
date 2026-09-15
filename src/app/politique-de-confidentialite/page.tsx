import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialite — Immo Gestion",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Politique de confidentialite" updated="15 septembre 2026">
      <LegalSection title="1. Portee">
        <p>
          Cette politique explique quelles renseignements personnels Immo Gestion (« nous », « le service »)
          recueille lorsque vous creez un compte et utilisez l&apos;application, comment nous les protegeons, et
          quels droits vous avez a leur egard. Elle s&apos;applique a tous les utilisateurs du service et est
          redigee conformement a la Loi sur la protection des renseignements personnels dans le secteur prive
          du Quebec, telle que modernisee par la Loi 25.
        </p>
      </LegalSection>

      <LegalSection title="2. Consentement">
        <p>
          En creant un compte, vous consentez a la collecte et a l&apos;utilisation de vos renseignements de
          la maniere decrite dans cette politique, pour la seule finalite de vous fournir le service que
          vous demandez. Ce consentement est demande explicitement, au moyen d&apos;une case a cocher, lors
          de la creation de votre compte. Vous pouvez retirer votre consentement en tout temps en fermant
          votre compte (voir section 7).
        </p>
      </LegalSection>

      <LegalSection title="3. Renseignements que nous recueillons">
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
          Aucun de ces renseignements n&apos;est considere « sensible » au sens de la loi (ex. donnees de
          sante, biometriques). Nous ne recueillons pas de donnees de localisation et ne suivons pas votre
          navigation a des fins publicitaires.
        </p>
      </LegalSection>

      <LegalSection title="4. Comment nous utilisons ces renseignements">
        <ul className="list-disc space-y-1 pl-5">
          <li>Vous authentifier et securiser l&apos;acces a votre compte.</li>
          <li>Faire fonctionner les fonctionnalites que vous utilisez (tableau de bord, gestion des baux, etc.).</li>
          <li>Vous contacter au sujet de votre compte si necessaire (ex. probleme de securite).</li>
        </ul>
        <p>
          Nous ne vendons ni ne louons vos renseignements personnels a des tiers, ne les utilisons pas a des
          fins publicitaires, et ne prenons aucune decision automatisee vous concernant a partir de ces
          renseignements.
        </p>
      </LegalSection>

      <LegalSection title="5. Temoins (cookies)">
        <p>
          Nous utilisons un seul temoin, strictement necessaire pour vous garder connecte a votre compte —
          aucun temoin de suivi, d&apos;analytique ou publicitaire. Voir notre{" "}
          <Link
            href="/politique-de-temoins"
            className="text-slate-900 underline hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded"
          >
            politique de temoins
          </Link>{" "}
          pour le detail complet.
        </p>
      </LegalSection>

      <LegalSection title="6. Ou et comment vos donnees sont stockees">
        <p>
          Vos donnees sont stockees dans une base de donnees exploitee par le fournisseur d&apos;hebergement du
          service. L&apos;acces aux donnees d&apos;un compte est strictement limite a ce compte : chaque
          enregistrement (immeuble, locataire, bail, paiement, billet de blog, etc.) est rattache a un seul
          compte et n&apos;est ni lisible ni modifiable par un autre utilisateur. Les mots de passe sont haches
          avec bcrypt et les sessions utilisent des jetons aleatoires stockes sous forme hachee. Nous ne
          transferons pas vos renseignements a l&apos;exterieur du Canada sans en avoir prealablement evalue
          les risques.
        </p>
      </LegalSection>

      <LegalSection title="7. Conservation et suppression">
        <p>
          Nous conservons vos renseignements tant que votre compte est actif. Vous pouvez demander la
          suppression complete de votre compte et de toutes les donnees associees en tout temps en nous
          contactant (voir section 11). La suppression est irreversible.
        </p>
      </LegalSection>

      <LegalSection title="8. Vos droits">
        <p>
          Conformement a la Loi 25 (Quebec) et, le cas echeant, a la Loi sur la protection des renseignements
          personnels et les documents electroniques (LPRPDE, Canada), vous avez le droit de :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Consulter les renseignements personnels que nous detenons a votre sujet;</li>
          <li>Faire corriger toute information inexacte, incomplete ou equivoque;</li>
          <li>
            Obtenir une copie de vos renseignements dans un format technologique structure et couramment
            utilise, et en demander la transmission a un autre responsable (droit a la portabilite);
          </li>
          <li>Demander la suppression de votre compte et de vos donnees;</li>
          <li>Retirer votre consentement en fermant votre compte.</li>
        </ul>
        <p>
          Pour exercer l&apos;un de ces droits, contactez-nous a la section 11. Nous repondrons dans les
          delais prevus par la loi. Si vous n&apos;etes pas satisfait de notre reponse, vous pouvez porter
          plainte aupres de la Commission d&apos;acces a l&apos;information du Quebec (CAI).
        </p>
      </LegalSection>

      <LegalSection title="9. Securite">
        <p>
          Nous appliquons des mesures de securite techniques raisonnables : chiffrement des mots de passe,
          sessions securisees (temoins httpOnly, SameSite), limitation des tentatives de connexion,
          isolation stricte des donnees entre comptes, et en-tetes de securite du navigateur. Aucune methode
          de transmission ou de stockage n&apos;est toutefois garantie a 100 % sure.
        </p>
      </LegalSection>

      <LegalSection title="10. Incident de confidentialite">
        <p>
          En cas d&apos;incident de confidentialite presentant un risque de prejudice serieux (par exemple
          un acces non autorise a des renseignements personnels), nous prendrons les mesures raisonnables
          pour reduire ce risque, tiendrons un registre de l&apos;incident, et aviserons la Commission
          d&apos;acces a l&apos;information du Quebec ainsi que les personnes concernees, conformement a nos
          obligations legales.
        </p>
      </LegalSection>

      <LegalSection title="11. Personne responsable de la protection des renseignements personnels">
        <p>
          Conformement a la loi, une personne est chargee de la mise en oeuvre de la presente politique et
          du traitement des demandes relatives a vos renseignements personnels. Pour toute question
          concernant cette politique ou pour exercer vos droits, contactez l&apos;administrateur du service
          a l&apos;adresse courriel associee a votre compte, ou via le courriel indique lors de votre
          inscription.
        </p>
      </LegalSection>

      <LegalSection title="12. Modifications">
        <p>
          Nous pouvons mettre a jour cette politique de temps a autre. La date de derniere mise a jour figure
          en haut de cette page. Nous vous encourageons a la consulter periodiquement.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
