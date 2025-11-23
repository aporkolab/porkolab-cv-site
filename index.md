---
layout: default
title: "SYSTEM::ROOT"
---

{% assign cv = site.data.cv_data %}

<div class="terminal-box">
    <div class="role-badge">SYS_ADMIN // LEVEL 99</div>
    <h1 class="glitch" data-text="{{ cv.name.en }}">{{ cv.name.en }}</h1>
    <div style="color: var(--neon-green); font-family: 'Orbitron'; letter-spacing: 1px;">
        > {{ cv.title.en }} <span style="animation: blink 1s infinite;">_</span>
    </div>

    <div style="margin-top: 2rem; border-top: 1px dashed #333; padding-top: 1rem; font-size: 0.9rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            {% if cv.contact.website %}
            <div>LINK_UPLINK: <a href="{{ cv.contact.website }}" target="_blank">SECURE_CONNECTION</a></div>
            {% endif %}
            {% if cv.contact.github %}
            <div>CODE_REPO: <a href="{{ cv.contact.github }}" target="_blank">GITHUB::ACCESS</a></div>
            {% endif %}
            <div>LOC_DATA: <span style="color: #fff">{{ cv.contact.location.en }}</span></div>
        </div>
    </div>
</div>

<section>
    <h2>// SYSTEM_OVERVIEW</h2>
    <p style="border-left: 2px solid var(--neon-pink); padding-left: 1rem; color: #ccc;">
        {{ cv.summary.en }}
    </p>
</section>

<section>
    <h2>// INSTALLED_MODULES</h2>
    
    {% if cv.skills.backend %}
    <div style="margin-bottom: 1.5rem;">
        <div style="color: var(--text-dim); margin-bottom: 0.5rem; font-size: 0.8rem;">[ BACKEND_PROTOCOLS ]</div>
        <div class="skill-container">
            {% for s in cv.skills.backend %} 
                <div class="tech-tag">{{ s }}</div> 
            {% endfor %}
        </div>
    </div>
    {% endif %}

    {% if cv.skills.frontend %}
    <div style="margin-bottom: 1.5rem;">
        <div style="color: var(--text-dim); margin-bottom: 0.5rem; font-size: 0.8rem;">[ FRONTEND_INTERFACE ]</div>
        <div class="skill-container">
            {% for s in cv.skills.frontend %} 
                <div class="tech-tag">{{ s }}</div> 
            {% endfor %}
        </div>
    </div>
    {% endif %}

    {% if cv.skills.tools %}
    <div>
        <div style="color: var(--text-dim); margin-bottom: 0.5rem; font-size: 0.8rem;">[ TOOLS_&_DEPLOYMENT ]</div>
        <div class="skill-container">
            {% for s in cv.skills.tools %} 
                <div class="tech-tag">{{ s }}</div> 
            {% endfor %}
        </div>
    </div>
    {% endif %}
</section>

<section>
    <h2>// RUNTIME_LOGS</h2>
    {% for exp in cv.experience %}
    <div class="xp-card">
        <div class="xp-role">{{ exp.role.en }}</div>
        <div class="xp-meta">
            {{ exp.company }} // {{ exp.period }} // <span style="color: var(--neon-cyan)">{{ exp.location.en }}</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0;">
            {% for item in exp.details.en %}
                <li style="margin-bottom: 0.5rem; position: relative; padding-left: 1.5rem;">
                    <span style="position: absolute; left: 0; color: var(--neon-green);">></span>
                    {{ item }}
                </li>
            {% endfor %}
        </ul>
    </div>
    {% endfor %}
</section>

{% if cv.publications %}
<section>
    <h2>// DATA_SHARDS</h2>
    <div style="display: grid; gap: 1rem;">
    {% for pub in cv.publications %}
        <div style="border: 1px solid #333; padding: 1rem; background: rgba(255,255,255,0.02);">
            <strong style="color: #fff; display: block; margin-bottom: 0.2rem;">{{ pub.title }}</strong>
            <div style="font-size: 0.85rem; color: var(--text-dim);">
                YEAR: {{ pub.year }} | TYPE: {{ pub.type }}
            </div>
        </div>
    {% endfor %}
    </div>
</section>
{% endif %}

<section style="margin-top: 5rem; text-align: center;">
    {% for item in site.data.cv_list.cvs limit:1 %}
    <a href="{{ item.url }}" class="cyber-btn" target="_blank">
        INITIATE_DOWNLOAD_SEQUENCE [PDF]
    </a>
    <div style="margin-top: 1rem; font-family: 'Orbitron'; color: var(--text-dim); font-size: 0.8rem;">
        LAST_UPDATED: {{ item.updated }} // SECURE_HASH_MATCH
    </div>
    {% endfor %}
</section>

<style>
@keyframes blink { 50% { opacity: 0; } }
</style>
