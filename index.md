---
layout: default
title: "Portfolio"
---

{% assign cv = site.data.cv_data %}

<div class="identity-panel">
    <div>
        <div class="role-title">System Architect</div>
        <h1>{{ cv.name.en }}</h1>
        <p style="color: #888; margin-top: 1.5rem; max-width: 400px;">
            {{ cv.summary.en }}
        </p>
    </div>

    <div style="margin-top: 3rem;">
        <div class="social-stack">
            {% if cv.contact.website %}
            <a href="{{ cv.contact.website }}" class="social-link" target="_blank">Portfolio / Web</a>
            {% endif %}
            {% if cv.contact.github %}
            <a href="{{ cv.contact.github }}" class="social-link" target="_blank">GitHub / Code</a>
            {% endif %}
            {% if cv.contact.linkedin %}
            <a href="{{ cv.contact.linkedin }}" class="social-link" target="_blank">LinkedIn / Connect</a>
            {% endif %}
            <div class="social-link" style="cursor: default; color: #444;">
                {{ cv.contact.location.en }}
            </div>
        </div>

        {% assign latest_cv = site.data.cv_list.cvs | first %}
        {% if latest_cv %}
            <a href="{{ latest_cv.url }}" class="dl-btn" target="_blank">
                Download CV
            </a>
            <div style="margin-top: 10px; font-size: 0.7rem; color: #444; font-family: monospace; text-align: center;">
                VERSION: {{ latest_cv.updated }}
            </div>
        {% else %}
            <a href="mailto:{{ cv.contact.email }}" class="dl-btn" style="opacity: 0.8">
                Request Access
            </a>
        {% endif %}
    </div>
</div>

<div class="data-panel">
    
    <section>
        <h2>Skills <span class="index">01</span></h2>
        
        {% if cv.skills.backend %}
        <div style="margin-bottom: 2rem;">
            <div style="color: #666; font-size: 0.8rem; margin-bottom: 1rem; text-transform: uppercase;">Backend / Core</div>
            <div class="skill-grid">
                {% for s in cv.skills.backend %} <div class="skill-box">{{ s }}</div> {% endfor %}
            </div>
        </div>
        {% endif %}

        {% if cv.skills.frontend %}
        <div>
            <div style="color: #666; font-size: 0.8rem; margin-bottom: 1rem; text-transform: uppercase;">Frontend / UI</div>
            <div class="skill-grid">
                {% for s in cv.skills.frontend %} <div class="skill-box">{{ s }}</div> {% endfor %}
            </div>
        </div>
        {% endif %}
    </section>

    <section>
        <h2>Timeline <span class="index">02</span></h2>
        {% for exp in cv.experience %}
        <div class="xp-item">
            <div class="xp-header">
                <div class="xp-role">{{ exp.role.en }}</div>
                <div class="xp-meta">
                    <span style="color: var(--accent);">{{ exp.company }}</span> / {{ exp.period }}
                </div>
            </div>
            <ul class="xp-list">
                {% for item in exp.details.en %}
                    <li>{{ item }}</li>
                {% endfor %}
            </ul>
        </div>
        {% endfor %}
    </section>

    {% if cv.publications or cv.awards %}
    <section>
        <h2>Achievements <span class="index">03</span></h2>
        
        {% if cv.publications %}
        <div style="margin-bottom: 2rem;">
            <div style="color: #fff; font-weight: 700; margin-bottom: 1rem;">Publications</div>
            {% for pub in cv.publications %}
            <div style="border-bottom: 1px solid var(--border); padding: 1rem 0; display: flex; justify-content: space-between;">
                <span style="color: #ccc;">{{ pub.title }}</span>
                <span style="color: #666; font-family: monospace;">{{ pub.year }}</span>
            </div>
            {% endfor %}
        </div>
        {% endif %}

        {% if cv.awards %}
        <div>
            <div style="color: #fff; font-weight: 700; margin-bottom: 1rem;">Awards</div>
            {% for award in cv.awards %}
            <div style="border-bottom: 1px solid var(--border); padding: 1rem 0; display: flex; justify-content: space-between;">
                <span style="color: #ccc;">{{ award.name }}</span>
                <span style="color: #666; font-family: monospace;">{{ award.year }}</span>
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </section>
    {% endif %}

    <footer style="margin-top: 6rem; padding-top: 2rem; border-top: 1px solid var(--border); color: #444; font-size: 0.8rem;">
        System Status: <span style="color: var(--accent)">OPTIMAL</span><br>
        © {{ "now" | date: "%Y" }} {{ cv.name.en }} // PORKOLAB_PERSONA_DELTA
    </footer>
</div>
