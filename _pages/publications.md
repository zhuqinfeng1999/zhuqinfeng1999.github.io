---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="wordwrap">You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}


# 2024
---  
[2] Samba: Semantic Segmentation of Remotely Sensed Images with State Space Model. [[Paper]](https://arxiv.org/abs/2404.01705) [[Code]](https://github.com/zhuqinfeng1999/Samba)   
<u>Qinfeng Zhu</u>, Yuanzhi Cai, Yuan Fang, Yihan Yang, Cheng Chen, Lei Fan, Anh Nguyen 
Under Review.

[1] Advancements in Point Cloud Data Augmentation for Deep Learning: A Survey. [[Paper]](https://arxiv.org/abs/2308.12113)
<u>Qinfeng Zhu</u>, Lei Fan, Ningxin Weng
Under Review.
