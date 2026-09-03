import { BookOpen, Truck, ShoppingCart, WalletCards } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Premium Collection",
    description:
      "Discover carefully selected Christian books, Bibles, devotionals, and inspirational resources from trusted publishers.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Enjoy quick and reliable delivery across India with secure packaging to keep every order safe.",
  },
  {
    icon: ShoppingCart,
    title: "Secure Checkout",
    description:
      "Shop with confidence using trusted payment methods protected by advanced security.",
  },
  {
    icon: WalletCards,
    title: "Affordable Prices",
    description:
      "Quality Christian books and faith-based products at prices you'll love, with regular offers throughout the year.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-6">
      <div className="container px-3 lg:px-6">
        <div className="overflow-hidden bg-[#fffaf0] rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className={`
                  group h-full px-5 py-6
                  sm:px-6
                  lg:px-7 lg:py-1
                  ${index > 0 ? "lg:border-l lg:border-gray-200" : ""}
                `}
                >
                  {/* Icon */}
                  <div className="mb-5">
                    <Icon
                      size={38}
                      strokeWidth={1.4}
                      className="text-orange-500 transition-transform duration-300 group-hover:-translate-y-1"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="title text-[21px] font-medium leading-tight text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="description mt-2 text-[15px] leading-[1.55] text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
