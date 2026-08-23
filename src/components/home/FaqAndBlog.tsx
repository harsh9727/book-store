import Faq from "@/components/common/Faq";
import Blogs from "@/components/common/Blogs";

const FaqAndBlog = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* FAQ Section - 5 columns */}
          <div className="lg:col-span-5 bg-[#fffaf0] rounded-2xl p-6">
            <Faq />
          </div>

          {/* Blogs Section - 7 columns */}
          <div className="lg:col-span-7 bg-[#fffaf0] rounded-2xl p-6">
            <Blogs limit={3} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAndBlog;
