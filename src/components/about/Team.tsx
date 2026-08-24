"use client";

import Image from "next/image";
import TeamImg1 from "../../../public/images/about/team-1.webp";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: TeamImg1,
  },
  {
    name: "Michael Lee",
    role: "Head of Operations",
    image: TeamImg1,
  },
  {
    name: "Emily Davis",
    role: "Head of Marketing",
    image: TeamImg1,
  },
  {
    name: "David Brown",
    role: "Customer Support Lead",
    image: TeamImg1,
  },
];

const Team = () => {
  return (
    <section
      aria-labelledby="team-heading"
      className="bg-white py-10"
    >
      <div className="container mx-auto px-4 lg:px-6">

        {/* ================= HEADING ================= */}
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="team-heading"
            className="title text-[30px] font-bold leading-tight tracking-tight text-orange-600 sm:text-[34px] md:text-[40px]"
          >
            Meet the Team
          </h2>

          <p className="description mt-3 text-sm leading-6 text-gray-600 md:text-[15px]">
            A team of book lovers working behind the scenes to bring you the
            best reading and shopping experience.
          </p>
        </div>

        {/* ================= TEAM GRID ================= */}
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)]"
            >
              {/* Member Image */}
              <div className="relative h-[260px] w-full overflow-hidden sm:h-[280px] lg:h-[290px]">
                <Image
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Member Info */}
              <div className="px-5 py-5">
                <h3 className="title text-[17px] font-bold text-gray-900">
                  {member.name}
                </h3>

                <p className="description mt-1 text-[13px] font-medium text-orange-600 md:text-sm">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;