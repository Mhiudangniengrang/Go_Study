import React, { useEffect, useState } from "react";
import { Avatar, Button, Carousel, notification, Select, Space } from "antd";
import user from "../assets/landing/image user.png";
import LandingPricing from "./landingPricing";
import useSpecialization from "../../hooks/useSpecialization";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useAuthen from "../../hooks/useAuthen";
const { Option, OptGroup } = Select;
const posts = [
  {
    id: 1,
    title: "Learn anytime, anywhere",
    image:
      "https://media.istockphoto.com/id/1349104991/photo/e-learning-online-education-concept.jpg?s=612x612&w=0&k=20&c=dta2tnpaC95FdcqSy4bpp2tLzBQDTCNajXeLxNsKXoo=",
    href: "#",
    description:
      "Go! Study is an indispensable website for FPT students. This website helps me save a lot of time and effort in finding classmates and study materials. I especially like the feature of creating study groups, which helps me and my classmates easily organize effective online group study sessions. Go! Study is a powerful companion for FPT students on their journey to conquer knowledge.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    author: {
      name: "Duong Minh Hieu",
      role: "SE",
      href: "#",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKUghmuIpSLwR9mfVBeMULKfTvlemDw23FTA&s",
    },
  },
  {
    id: 2,
    title: "Knowledge at fingertips",
    image:
      "https://media.istockphoto.com/id/1290864946/photo/e-learning-education-concept-learning-online.jpg?s=612x612&w=0&k=20&c=y1fQ-3wbsvdDaMn-cuHPibcgozOxKQS99mIgz6DFcVA=",
    href: "#",
    description:
      "Go! Study is an amazing website for FPT students like me! Thanks to this website, I can easily find classmates to discuss assignments, study for exams, and share study experiences.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    author: {
      name: "Phung Dang Khoa",
      role: "SE",
      href: "#",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSshXuh9s1y0b6gTIrLpVNTN1wHR3PpjcBgabC7Q2jKN66AvfPhKWXvJqVqnc9HApzbzAc&usqp=CAU",
    },
  },
  {
    id: 3,
    title: "Flexible study schedule",
    image:
      "https://media.istockphoto.com/id/1288092444/photo/student-using-laptop-having-online-class-with-teacher.jpg?s=612x612&w=0&k=20&c=hI_apluBFBOEzizTYeXzFd26r9Z6QyawI8_Ta9-_sDM=",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    author: {
      name: "Dang Phuong Thao",
      role: "GD",
      href: "#",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJMlpRhf2iRBJQs3l0GhTFnkrSHB8LZvL5FbFWgrYn92i1clX2UpkH28S241e_mbD44e0&usqp=CAU",
    },
  },
];

const videos = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/4492129/pexels-photo-4492129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/5553070/pexels-photo-5553070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/4050419/pexels-photo-4050419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

function LandingUser() {
  const { specialization, fetchGetSpecialization, fetchPostSpecialization } =
    useSpecialization();
  const { infoUser, fetchUserInfo } = useAuthen();
  const [selectedMajors, setSelectedMajors] = useState([]);
  const userId = Cookies.get("userId");
  const navigate = useNavigate();
  useEffect(() => {
    fetchGetSpecialization();
    fetchUserInfo(userId);
  }, [fetchGetSpecialization, fetchUserInfo, userId]);
  console.log("check", infoUser.specialization);

  const handleConfirm = () => {
    const existingSpecializations = infoUser.specialization.map((spec) =>
      spec.name.trim()
    );

    const newMajors = selectedMajors.filter(
      (major) => !existingSpecializations.includes(major.trim())
    );

    if (newMajors.length === 0) {
      notification.warning({
        message: "Duplicate Specialization",
        description:
          "Bạn đã chọn specialization này rồi. Vui lòng chọn specialization khác để tránh bị trùng.",
      });
      return;
    }

    const specializationIds = newMajors
      .map((major) => {
        const found = specialization.find(
          (spec) => spec.name.trim() === major.trim()
        );
        return found ? found.specializationId : null;
      })
      .filter((specializationId) => specializationId !== null);

    fetchPostSpecialization(userId, specializationIds);
    navigate("/user/home"); 
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between mt-10 bg-white">
        <div className="mx-auto lg:mx-27 text-center lg:text-left">
          <h1 className="text-5xl font-bold text-blue-900">Welcome to</h1>
          <div className="mx-8">
            <p className="text-8xl mt-4 font-semibold">
              <span className="text-orange-500">Go! </span>
              <span className="text-blue-900">Study</span>
            </p>
          </div>
          <div className="my-8 space-y-4">
            <Select
              mode="multiple"
              placeholder="Choose your majors"
              className="w-full lg:w-4/5 text-center custom-select"
              size="large"
              value={selectedMajors}
              onChange={setSelectedMajors}
              maxTagCount={2}
              maxTagPlaceholder={(omittedValues) =>
                `+${omittedValues.length} more`
              }
            >
              {specialization.map((major) => (
                <Option key={major.id} value={major.name}>
                  {major.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex justify-center lg:justify-start space-x-5">
            <Button
              type="default"
              size="large"
              className="bg-orange-500 text-white w-[100%] p-20 py-2 rounded-md"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Link to="/user/home">
              <Button
                type="default"
                size="large"
                className="border border-orange-500 text-orange-500 w-[40%] p-20 py-2 rounded-md"
              >
                Skip
              </Button>
            </Link>
          </div>
        </div>
        <img
          src={user}
          className="w-full lg:w-[50%] h-auto mt-8 lg:mt-0"
          alt="Illustration"
        />
      </div>
      <p className="text-[#D1E7FF] font-semibold bg-[#034EA1] p-8 text-center text-lg">
        "Experience a new form of learning with friends who share the same
        ideals at FPT University".
      </p>
      <Carousel autoplay>
        {videos.map((video) => (
          <div key={video.id}>
            <img
              src={video.image}
              alt=""
              className="w-full h-[45rem] object-cover"
            />
          </div>
        ))}
      </Carousel>
      <div className="pt-16 px-8 bg-white text-center">
        <h3 className="text-4xl text-orange-500 mb-6">
          Loved by FPT University students!
        </h3>
        <Button className="bg-white border border-blue-500 text-blue-500 px-4 rounded-full">
          See all stories →
        </Button>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-gray-200 pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col items-start justify-between h-full p-4 border rounded-lg transition-transform transform hover:scale-105"
                >
                  <img alt="" src={post.image} className="w-full mb-4" />
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.datetime} className="text-gray-500">
                      {post.date}
                    </time>
                  </div>
                  <div className="group relative flex-grow">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <a href={post.href}>{post.title}</a>
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-600 text-left">
                      {post.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <img
                      alt=""
                      src={post.author.imageUrl}
                      className="h-10 w-10 rounded-full bg-gray-50"
                    />
                    <div className="text-sm leading-6 text-left">
                      <p className="font-semibold text-gray-900">
                        <a href={post.author.href}>
                          <span className="absolute inset-0" />
                          {post.author.name}
                        </a>
                      </p>
                      <p className="text-gray-600">{post.author.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      <LandingPricing />
    </>
  );
}

export default LandingUser;
