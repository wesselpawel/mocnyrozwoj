"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  FaArrowLeft,
  FaChevronDown,
  FaClipboardList,
  FaHome,
  FaImages,
  FaPlus,
  FaSignOutAlt,
  FaGraduationCap,
  FaBook,
  FaQuestionCircle,
  FaUsers,
  FaNewspaper,
  FaEdit,
  FaUpload,
} from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
export default function Nav({
  isNavOpen,
  setNavOpen,
}: {
  isNavOpen: boolean;
  setNavOpen: Function;
}) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  interface NavSubItem {
    title: string;
    href: string;
    icon: ReactNode;
  }
  interface NavItem {
    title: string;
    href: string;
    icon: ReactNode;
    expandable?: boolean;
    subItems?: NavSubItem[];
  }

  const navItems: NavItem[] = [
    { title: "Przegląd", href: `/admin`, icon: <FaHome /> },
    {
      title: "Kursy",
      href: `/admin/courses`,
      expandable: true,
      icon: <FaGraduationCap />,
      subItems: [
        {
          title: "Dodaj kurs",
          href: `/admin/courses/add`,
          icon: <FaPlus />,
        },
        {
          title: "Wszystkie kursy",
          href: `/admin/courses/list`,
          icon: <FaBook />,
        },
        {
          title: "Dodaj pytania",
          href: `/admin/courses/add-questions`,
          icon: <FaQuestionCircle />,
        },
      ],
    },
    {
      title: "Blog",
      href: `/admin/blog`,
      expandable: true,
      icon: <FaNewspaper />,
      subItems: [
        {
          title: "Nowy post",
          href: `/admin/blog/new`,
          icon: <FaUpload />,
        },
        {
          title: "Wszystkie posty",
          href: `/admin/blog/list`,
          icon: <FaEdit />,
        },
        {
          title: "Edytuj post",
          href: `/admin/blog/edit`, // This can be a placeholder or a landing page for editing
          icon: <FaEdit />,
        },
      ],
    },
    {
      title: "Diety",
      href: `/admin/diet`,
      expandable: true,
      icon: <FaImages />,
      subItems: [
        {
          title: "Dodaj dietę",
          href: `/admin/diet/add`,
          icon: <FaPlus />,
        },
        {
          title: "Wszystkie diety",
          href: `/admin/diet`,
          icon: <FaImages />,
        },
      ],
    },
    {
      title: "Dodaj produkt",
      href: `/admin/shop/add-product`,
      icon: <FaPlus />,
    },
    {
      title: "Wszystkie produkty",
      href: `/admin/shop/products`,
      icon: <FaImages />,
    },
    {
      title: "Zamówienia",
      href: `/admin/shop/orders`,
      icon: <FaClipboardList />,
    },
    {
      title: "FAQ",
      href: `/admin/faq`,
      icon: <FaQuestionCircle />,
    },
    {
      title: "Leady",
      href: `/admin/leads`,
      icon: <FaUsers />,
    },
    {
      title: "Logout",
      href: `/admin/logout`,
      icon: <FaSignOutAlt />,
    },
  ];

  return (
    <div
      className={`fixed z-[51] scrollbar font-ubuntu font-light !text-white duration-500 ${
        isNavOpen ? "translate-x-[0]" : "-translate-x-[300px]"
      }`}
    >
      <div className="flex flex-col h-screen w-[300px] border-r-[1px] border-[#303345] bg-[#222430] ">
        <div className="text-white py-4 px-3 relative">
          <h1 className="text-base font-bold  flex flex-row items-center ">
            <Image
              src="/logo.png"
              width={36}
              height={36}
              alt=""
              className="w-8 h-8 mr-2"
            />{" "}
            Panel administracyjny
          </h1>
          <button
            onClick={() => setNavOpen(!isNavOpen)}
            className="absolute -right-[50px] w-[50px] h-[50px] top-0 !z-[9999999] bg-[#222430] text-white flex items-center justify-center"
          >
            <FaArrowLeft
              className={`${isNavOpen ? "rotate-0" : "rotate-180"}`}
            />
          </button>
        </div>
        <div className="mt-12">
          <ul className="flex flex-col flex-wrap justify-between w-full px-2">
            {navItems.map((item: NavItem, index: number) => (
              <li
                key={index}
                className={`w-full ${item.expandable ? "relative" : ""}  `}
              >
                <Link href={item.href} className="w-full">
                  <button
                    onClick={() => {
                      if (item.expandable) {
                        if (expandedItems.includes(index)) {
                          setExpandedItems(
                            expandedItems.filter((i) => i !== index)
                          );
                        } else {
                          setExpandedItems([...expandedItems, index]);
                        }
                      }
                    }}
                    className={`${
                      item.expandable ? "cursor-pointer" : ""
                    } flex items-center justify-between py-2 px-4 rounded-md hover:bg-[#2F313C] w-full`}
                  >
                    <span className="flex flex-row items-center">
                      <span className="mr-2">{item.icon}</span>
                      {item.title}
                    </span>
                    {item.expandable && (
                      <div
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (item.expandable) {
                            if (expandedItems.includes(index)) {
                              setExpandedItems(
                                expandedItems.filter((i) => i !== index)
                              );
                            } else {
                              setExpandedItems([
                                ...expandedItems,
                                index,
                              ]);
                            }
                          }
                        }}
                        className="hover:bg-[#3B3D47] p-1 lg:p-2 rounded-md"
                      >
                        <FaChevronDown
                          className={`duration-300 ${
                            expandedItems.includes(index)
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        />
                      </div>
                    )}
                  </button>
                </Link>

                {item.expandable && expandedItems.includes(index) && (
                  <ul className=" bg-[#222430]  py-2 px-4 w-full">
                    {(item.subItems ?? []).map((subItem: NavSubItem, subIndex: number) => (
                      <li key={subIndex}>
                        <Link href={subItem.href}>
                          <button className="flex items-center py-2 px-4 rounded-md hover:bg-[#2F313C] w-full">
                            {subItem.icon}
                            <span className="ml-2">{subItem.title}</span>
                          </button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
