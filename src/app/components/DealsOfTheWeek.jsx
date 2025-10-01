import DealCard from './DealCard';

const DealsOfTheWeek = () => (
    <section className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white p-4 bg-orange-950 rounded-xl shadow-lg">
                🔥 Deals of the Week
            </h2>
            {/* Responsive Grid Setup: 2 cols on mobile, 3 on medium, 4 on large */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <DealCard title="African Bag" price="KSh 1500" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/01/6954523/1.jpg?0713" />
                <DealCard title="African Print" price="KSh 1500" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/61/159292/1.jpg?8733" />
                <DealCard title="Susu Bag" price="KSh 2500" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728" />
                <DealCard title="African Print" price="KSh 1500" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/61/159292/1.jpg?8733" />
                {/* Added extra items for better visual representation of the responsive grid */}
                {/* <DealCard title="Handmade Basket" price="KSh 3200" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/95/437990/1.jpg" />
                <DealCard title="Woven Mat" price="KSh 1200" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/21/536137/1.jpg" /> */}
            </div>
        </div>
    </section>
);

export default DealsOfTheWeek;