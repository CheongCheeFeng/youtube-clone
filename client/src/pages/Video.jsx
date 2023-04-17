import {
  AddTaskOutlined,
  ReplyOutlined,
  ThumbDown,
  ThumbDownOffAltOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  dislike,
  fetchFailure,
  fetchStart,
  fetchSuccess,
  like,
} from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 6;
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Recomendation = styled.div`
  flex: 2;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  gap: 20px;
  display: flex;
`;

const ChannelDetails = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.div`
  font-weight: 500;
`;

const ChannelCounter = styled.div`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const Subsribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  width: 100%;
  max-height: 720px;
  object-fit: cover;
`;

const Video = () => {
  const path = useLocation().pathname.split("/")[2];

  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchStart());
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );

        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (error) {
        dispatch(fetchFailure);
      }
    };

    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    try {
      await axios.put(`/users/like/${currentVideo._id}`);
      dispatch(like(currentUser._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`/users/dislike/${currentVideo._id}`);
      dispatch(dislike(currentUser._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscription = async () => {
    try {
      if (currentUser.subscribedUsers.includes(channel._id)) {
        await axios.put(`/users/unsubscribe/${channel._id}`);
      } else {
        await axios.put(`/users/subscribe/${channel._id}`);
      }
      dispatch(subscription(channel._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    currentVideo && (
      <Container>
        <Content>
          <VideoWrapper>
            <VideoFrame src={currentVideo.videoUrl} controls />
          </VideoWrapper>
          <Title>{currentVideo.title}</Title>
          <Details>
            <Info>
              {currentVideo.views} • {format(currentVideo.createdAt)}
            </Info>
            <Buttons>
              <Button onClick={handleLike}>
                {currentVideo.likes?.includes(currentUser?._id) ? (
                  <ThumbUp />
                ) : (
                  <ThumbUpOutlined />
                )}{" "}
                {currentVideo.likes?.length}
              </Button>
              <Button onClick={handleDislike}>
                {currentVideo.dislikes?.includes(currentUser?._id) ? (
                  <ThumbDown />
                ) : (
                  <ThumbDownOffAltOutlined />
                )}{" "}
                Disliked
              </Button>
              <Button>
                <ReplyOutlined /> Share
              </Button>
              <Button>
                <AddTaskOutlined /> Save
              </Button>
            </Buttons>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <Image src={channel.img}></Image>
              <ChannelDetails>
                <ChannelName>{channel.name}</ChannelName>
                <ChannelCounter>{channel.subscribers}</ChannelCounter>
                <Description>{currentVideo.desc}</Description>
              </ChannelDetails>
            </ChannelInfo>
            <Subsribe onClick={handleSubscription}>
              {currentUser.subscribedUsers?.includes(channel._id)
                ? "SUBSCRIBED"
                : "SUBSCRIBE"}
            </Subsribe>
          </Channel>
          <Hr />
          <Comments videoId={currentVideo._id} />
        </Content>
        {/* <Recomendation>
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
      </Recomendation> */}
      </Container>
    )
  );
};

export default Video;
