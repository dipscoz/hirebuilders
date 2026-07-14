export default function MetierPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-10">

      <h1 className="text-4xl font-bold text-gray-900">
        Nos métiers du bâtiment
      </h1>

      <p className="mt-4 text-gray-600">
        Découvrez les professionnels disponibles pour vos projets.
      </p>


      <div className="grid md:grid-cols-3 gap-6 mt-10">


        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Maçon
          </h2>
          <p>
            Construction, murs, fondations et rénovation.
          </p>
        </div>


        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Électricien
          </h2>
          <p>
            Installation électrique bâtiment.
          </p>
        </div>


        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">
            Plombier
          </h2>
          <p>
            Installation et réparation plomberie.
          </p>
        </div>


      </div>


    </main>
  );
}