---
layout: default
title: CV
---

{% assign cv = site.data.cv_data %}

<header>
  <h1>{{ cv.name.en }}</h1>
  <div class="subtitle">{{ cv.title.en }}</div>
  
  <div style="margin-top: 1rem;">
    {% if cv.contact.website %}
      <a href="{{ cv.contact.website }}">{{ cv.contact.website | remove: "https://" }}</a> • 
    {% endif %}
    {% if cv.contact.github %}
      <a href="{{ cv.contact.github }}">GitHub</a> • 
    {% endif %}
    {{ cv.contact.location.en }}
  </div>
</header>

<section>
  <h2>Summary</h2>
  <p>{{ cv.summary.en }}</p>
</section>

<section>
  <h2>Experience</h2>
  {% for exp in cv.experience %}
  <div class="card">
    <h3>{{ exp.role.en }}</h3>
    <div class="meta">{{ exp.company }} • {{ exp.period }} • {{ exp.location.en }}</div>
    <ul>
      {% for item in exp.details.en %}
        <li>{{ item }}</li>
      {% endfor %}
    </ul>
  </div>
  {% endfor %}
</section>

<section>
  <h2>Skills</h2>
  
  {% if cv.skills.backend %}
  <div class="mb-4">
    <strong style="color: #94a3b8; display: block; margin-bottom: 0.5rem;">Backend</strong>
    {% for s in cv.skills.backend %} <span class="tag">{{ s }}</span> {% endfor %}
  </div>
  {% endif %}

  {% if cv.skills.frontend %}
  <div class="mb-4">
    <strong style="color: #94a3b8; display: block; margin-bottom: 0.5rem; margin-top: 1rem;">Frontend</strong>
    {% for s in cv.skills.frontend %} <span class="tag">{{ s }}</span> {% endfor %}
  </div>
  {% endif %}
</section>

{% if cv.publications %}
<section>
  <h2>Publications</h2>
  {% for pub in cv.publications %}
    <div style="margin-bottom: 0.5rem;">
      <strong>{{ pub.title }}</strong> ({{ pub.year }}) <span style="color:#94a3b8">— {{ pub.type }}</span>
    </div>
  {% endfor %}
</section>
{% endif %}

<section style="margin-top: 4rem; border-top: 1px solid #334155; padding-top: 2rem; text-align: center;">
  <h3 style="margin-bottom: 1rem;">Download PDF Version</h3>
  {% for item in site.data.cv_list.cvs limit:1 %}
    <a href="{{ item.url }}" class="download-btn">Download Latest PDF</a>
    <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #94a3b8;">Last updated: {{ item.updated }}</div>
  {% endfor %}
</section>
