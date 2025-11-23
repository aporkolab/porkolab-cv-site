---
layout: default
title: 'Curriculum Vitae'
---

# Current CVs

Below you can find the most recent public CVs:

<ul>
{% for item in site.data.cv_list.cvs %}
  <li>
    <strong>{{ item.name }}</strong> –
    <a href="{{ item.url }}" target="_blank">Open PDF</a>
    <small>(updated: {{ item.updated }})</small>
  </li>
{% endfor %}
</ul>
