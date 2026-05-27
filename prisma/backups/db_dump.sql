--
-- PostgreSQL database dump
--

\restrict 8vABI8ZOwU2EDY1FHy52YU3wDTvEEbMURSL9BARTcehfmqzES99f9g1Kg1aJbNt

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    resource text NOT NULL,
    "resourceId" text,
    metadata jsonb,
    ip text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "coverImage" text,
    template text DEFAULT 'classic'::text NOT NULL,
    category text,
    tags text[],
    "readTime" integer DEFAULT 5 NOT NULL,
    author text,
    "aiGenerated" boolean DEFAULT false NOT NULL,
    "aiOutline" jsonb,
    status text DEFAULT 'draft'::text NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "metaTitle" text,
    "metaDescription" text,
    "ogImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: color_palettes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.color_palettes (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT false NOT NULL,
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdBy" text,
    colors jsonb NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    "fontDisplay" text DEFAULT 'Syne'::text NOT NULL,
    "fontBody" text DEFAULT 'DM Sans'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.color_palettes OWNER TO postgres;

--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    service text,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: custom_fonts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_fonts (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    "fileName" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.custom_fonts OWNER TO postgres;

--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id text NOT NULL,
    title text,
    type text NOT NULL,
    "mimeType" text,
    size integer,
    url text NOT NULL,
    thumbnail text,
    "muxAssetId" text,
    "muxPlaybackId" text,
    "muxStatus" text,
    width integer,
    height integer,
    duration double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "muxUploadId" text
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: page_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_versions (
    id text NOT NULL,
    "pageId" text NOT NULL,
    sections jsonb NOT NULL,
    version integer NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.page_versions OWNER TO postgres;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pages (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    sections jsonb DEFAULT '[]'::jsonb NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "metaTitle" text,
    "metaDescription" text,
    "ogImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pages OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    "roleId" text NOT NULL,
    resource text NOT NULL,
    action text NOT NULL,
    scope text
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: portfolio_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_items (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    client text,
    category text NOT NULL,
    description text,
    content text,
    "coverImage" text NOT NULL,
    images text[],
    tags text[],
    results jsonb,
    year integer,
    "isPublished" boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.portfolio_items OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    type text DEFAULT 'string'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    image text,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLogin" timestamp(3) without time zone,
    "roleId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "userId", action, resource, "resourceId", metadata, ip, "createdAt") FROM stdin;
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, title, slug, excerpt, content, "coverImage", template, category, tags, "readTime", author, "aiGenerated", "aiOutline", status, "publishedAt", "metaTitle", "metaDescription", "ogImage", "createdAt", "updatedAt") FROM stdin;
cmp1eyb4l002fi3cir0czt77q	Performance Marketing'de 2025'in 5 Trendi	performance-marketing-2025-trendleri	Dijital reklamcılık hızla değişiyor. Bu yıl öne çıkan 5 trendi ve markanız için ne anlama geldiğini keşfedin.	# Performance Marketing'de 2025'in 5 Trendi\n\nDijital reklamcılık ekosistemi her geçen yıl köklü değişimler geçiriyor...	\N	editorial	Performance Marketing	{performance,dijital,trend,2025}	6	\N	f	\N	published	2026-05-11 16:25:49.358	\N	\N	\N	2026-05-11 16:25:50.038	2026-05-11 16:25:50.038
cmp1eyb4p002gi3ciwg0mygni	Marka Kimliği: Neden Her Şeyin Temeli?	marka-kimligi-temel	Güçlü bir marka kimliği olmadan hiçbir kampanya tam anlamıyla çalışmaz. İşte sebebi.	# Marka Kimliği: Neden Her Şeyin Temeli?\n\nMarka kimliği, bir işletmenin görsel ve duygusal parmak izidir...	\N	classic	Marka Stratejisi	{marka,kimlik,strateji}	5	\N	f	\N	published	2026-05-04 16:25:49.358	\N	\N	\N	2026-05-11 16:25:50.042	2026-05-11 16:25:50.042
cmp1eyb4r002hi3cichkyzg92	Creative Brief Yazmanın Sanatı	creative-brief-yazma-sanati	İyi bir creative brief, kampanyanın yarısıdır. Mükemmel brief'i nasıl yazarsınız?	# Creative Brief Yazmanın Sanatı\n\nBir reklam kampanyasının başarısı, çoğu zaman brief kalitesine bağlıdır...	\N	visual	Creative	{creative,brief,kampanya}	4	\N	f	\N	draft	\N	\N	\N	\N	2026-05-11 16:25:50.043	2026-05-11 16:25:50.043
\.


--
-- Data for Name: color_palettes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.color_palettes (id, name, description, "isActive", "isSystem", "createdBy", colors, settings, "fontDisplay", "fontBody", "createdAt", "updatedAt") FROM stdin;
cmp4j67qy0000i3y6haoelaho	Ömer	\N	t	f	cmp1eyb4e002ei3ci80keweaq	{"dark": {"border": "#2A2A2A", "surface": "#1A1A1A", "background": "#0C0C0C", "foreground": "#F0F0F0", "borderStrong": "#3A3A3A", "backgroundAlt": "#111111", "foregroundFaint": "#555555", "foregroundMuted": "#888888", "surfaceElevated": "#222222"}, "error": "#dc2626", "border": "#E0E0E0", "primary": "#FF4FD8", "success": "#16a34a", "surface": "#F2F2F2", "warning": "#d97706", "secondary": "#323232", "background": "#FFFFFF", "foreground": "#111111", "primaryGlow": "rgba(161, 52, 255, 0.35)", "borderStrong": "#CCCCCC", "primaryHover": "#8B1FE8", "primaryMuted": "rgba(161, 52, 255, 0.12)", "backgroundAlt": "#F7F7F7", "secondaryLight": "#484848", "foregroundFaint": "#999999", "foregroundMuted": "#666666", "surfaceElevated": "#FFFFFF"}	{"buttonShape": "rounded", "fontBodySize": 16, "mobileNavbar": true, "headerVariant": "classic", "containerShape": "rounded", "fontHeadingSize": 32, "mobileNavbarVariant": "dock"}	Syne	Montserrat	2026-05-13 20:47:15.898	2026-05-13 20:48:02.763
default-flixflex	FlixFlex Default	\N	f	t	\N	{"dark": {"border": "#2A2A2A", "surface": "#1A1A1A", "background": "#0C0C0C", "foreground": "#F0F0F0", "borderStrong": "#3A3A3A",("backgroundAlt"):("#111111"),("foregroundFaint"):("#555555"),("foregroundMuted"):("#888888"),("surfaceElevated"):("#222222")},("error"):("#dc2626"),("border"):("#E0E0E0"),("primary"):("#FF4FD8"),("success"):("#16a34a"),("surface"):("#F2F2F2"),("warning"):("#d97706"),("secondary"):("#323232"),("background"):("#FFFFFF"),("foreground"):("#111111"),("primaryGlow"):("rgba(161, 52, 255, 0.35)"),("borderStrong"):("#CCCCCC"),("primaryHover"):("#8B1FE8"),("primaryMuted"):("rgba(161, 52, 255, 0.12)"),("backgroundAlt"):("#F7F7F7"),("secondaryLight"):("#484848"),("foregroundFaint"):("#999999"),("foregroundMuted"):("#666666"),("surfaceElevated"):("#FFFFFF")}	{"buttonShape": "bevel", "fontBodySize": 16, "mobileNavbar": true, "headerVariant": "hamburger",="containerShape":"rounded","fontHeadingSize":"3２","mobileNavbarVariant":"dock"}	Syne	DM Sans	２０２６－０５－１１ １６：２５：５０．０３４	２０２６－０５－１３ ２０：４８：０２．７６３
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, name, email, company, service, message, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: custom_fonts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_fonts (id, name, url, "fileName", "createdAt") FROM stdin;
cmp1k9c0q0000i3ig12ahm1od	Roboto	/fonts/custom/1778525662489-Roboto-VariableFont_wdth,wght.ttf	1778525662489-Roboto-VariableFont_wdth,wght.ttf	2026-05-11 18:54:22.49
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, title, type, "mimeType", size, url, thumbnail, "muxAssetId", "muxPlaybackId", "muxStatus", width, height, duration, "createdAt", "updatedAt", "muxUploadId") FROM stdin;
\.


--
-- Data for Name: page_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.page_versions (id, "pageId", sections, version, note, "createdAt") FROM stdin;
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pages (id, slug, title, description, sections, "isPublished", "publishedAt", "metaTitle", "metaDescription", "ogImage", "createdAt", "updatedAt") FROM stdin;
cmp1eyb4x002li3ci9wa4awsx	hakkimizda	Hakkımızda	FlixFlex hakkında	[]	t	\N	\N	\N	\N	2026-05-11 16:25:50.05	2026-05-11 16:25:50.05
cmp1ifh4s002mi3jyqpv4mq4f	hizmetler	Hizmetler	FlixFlex hizmetleri	[{"id": "hz1", "type": "hero", "order": 0, "props": {"headline": "Markanı domine etmek için 6 yol", "subheadline": "Strateji, yaratıcılık ve teknoloji — üçünü aynı anda doğru kullanan markalar öne çıkar. İşte biz de tam olarak bunu yapıyoruz."}, "visible": true}, {"id": "hz2", "type": "services-list", "order": 1, "props": {}, "visible": true}, {"id": "hz3", "type": "cta", "order": 2, "props": {}, "visible": true}]	t	\N	\N	\N	\N	2026-05-11 18:03:09.821	2026-05-11 18:03:09.821
cmp1ifh4u002ni3jy5ilingb2	portfolio	Portfolyo	Seçili işlerimiz	[{"id": "pf1", "type": "portfolio-hero", "order": 0, "props": {}, "visible": true}, {"id": "pf2", "type": "portfolio-grid", "order": 1, "props": {}, "visible": true}, {"id": "pf3", "type": "cta", "order": 2, "props": {}, "visible": true}]	t	\N	\N	\N	\N	2026-05-11 18:03:09.822	2026-05-11 18:03:09.822
cmp1ifh4v002oi3jyl35tm7w8	blog	Blog	Düşünceler & İçgörüler	[{"id": "bl1", "type": "blog-hero", "order": 0, "props": {}, "visible": true}, {"id": "bl2", "type": "blog-grid", "order": 1, "props": {}, "visible": true}, {"id": "bl3", "type": "cta", "order": 2, "props": {}, "visible": true}]	t	\N	\N	\N	\N	2026-05-11 18:03:09.824	2026-05-11 18:03:09.824
cmp1ifh4w002pi3jyjbm3efid	iletisim	İletişim	Bize ulaşın	[{"id": "ct1", "type": "contact-hero", "order": 0, "props": {}, "visible": true}, {"id": "ct2", "type": "contact-info", "order": 1, "props": {}, "visible": true}, {"id": "ct3", "type": "why-us", "order": 2, "props": {}, "visible": true}, {"id": "ct4", "type": "faq", "order": 3, "props": {}, "visible": true}]	t	\N	\N	\N	\N	2026-05-11 18:03:09.825	2026-05-11 18:03:09.825
cmp1eyb4v002ki3cimz69llar	anasayfa	Ana Sayfa	FlixFlex ana sayfası	[{"id": "b45up0avmp4gjztd", "type": "hero-video", "order": 0, "props": {"ctaHref": "/iletisim", "ctaLabel": "Projeyi Başlat", "headline": "Sinematik Başlık", "videoUrl": "/hero-background.mp4", "posterUrl": "", "subheadline": "Markanızı videoyla anlatın", "secondaryCtaHref": "/portfolio", "secondaryCtaLabel": "Showreel İzle"}, "visible": true, "transition": "sticky"}, {"id": "9hg6zzkmmp1if95z", "type": "portfolio", "order": 1, "props": {"headline": "Portfolyo", "maxItems": 6, "subheadline": "Seçkin projelerimiz", "filterEnabled": true}, "visible": true, "stickyPin": false, "transition": "overlap"}, {"id": "ny210vuymp1if79v", "type": "services", "order": 2, "props": {"showAll": false, "headline": "Hizmetlerimiz", "subheadline": "İşletmeniz için kapsamlı dijital çözümler"}, "visible": true, "transition": "normal"}, {"id": "kjqbnz8nmp1ifbpv", "type": "cta", "order": 3, "props": {"eyebrow": "— Bir Sonraki Adım —", "variant": "dark", "headline": "Birlikte büyüyelim mi?", "description": "Brief'ini paylaş, hemen toplanalım.", "primaryCtaHref": "/iletisim", "primaryCtaLabel": "İletişime Geç", "secondaryCtaHref": "/portfolio", "secondaryCtaLabel": "Portfolyoyu Gör"}, "visible": true, "transition": "normal"}, {"id": "2d6n22szmp1ifbyc", "type": "contact-form", "order": 4, "props": {"showMap": true, "headline": "İletişime Geç", "subheadline": "Hemen konuşalım", "primaryColor": "#FF4FD8"}, "visible": true, "transition": "normal"}]	t	2026-05-14 04:08:34.142	\N	\N	\N	2026-05-11 16:25:50.048	2026-05-14 04:08:34.143
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, "roleId", resource, action, scope) FROM stdin;
cmp1ifguj0001i3jydmho7g6k	cmp1eyavw0000i3ci3gn2iflv	blog	read	\N
cmp1ifguj0002i3jyibe22xmp	cmp1eyavw0000i3ci3gn2iflv	blog	create	\N
cmp1ifguj0003i3jy5a0nvbl6	cmp1eyavw0000i3ci3gn2iflv	blog	update	\N
cmp1ifguj0004i3jy77b63fre	cmp1eyavw0000i3ci3gn2iflv	blog	delete	\N
cmp1ifguj0005i3jyky6f6w6o	cmp1eyavw0000i3ci3gn2iflv	blog	publish	\N
cmp1ifguj0006i3jy8j211rcg	cmp1eyavw0000i3ci3gn2iflv	blog	manage	\N
cmp1ifguj0007i3jynjaxuaje	cmp1eyavw0000i3ci3gn2iflv	pages	read	\N
cmp1ifguj0008i3jy33oiaarb	cmp1eyavw0000i3ci3gn2iflv	pages	create	\N
cmp1ifguj0009i3jypxj8qba1	cmp1eyavw0000i3ci3gn2iflv	pages	update	\N
cmp1ifguj000ai3jy30a2wete	cmp1eyavw0000i3ci3gn2iflv	pages	delete	\N
cmp1ifguj000bi3jyejd9hw28	cmp1eyavw0000i3ci3gn2iflv	pages	publish	\N
cmp1ifguj000ci3jyod8q35td	cmp1eyavw0000i3ci3gn2iflv	pages	manage	\N
cmp1ifguj000di3jy75wu58vf	cmp1eyavw0000i3ci3gn2iflv	portfolio	read	\N
cmp1ifguj000ei3jy3hza1rim	cmp1eyavw0000i3ci3gn2iflv	portfolio	create	\N
cmp1ifguj000fi3jyrorxu3i4	cmp1eyavw0000i3ci3gn2iflv	portfolio	update	\N
cmp1ifguj000gi3jy9zvwb3dt	cmp1eyavw0000i3ci3gn2iflv	portfolio	delete	\N
cmp1ifguj000hi3jykewvzmtx	cmp1eyavw0000i3ci3gn2iflv	portfolio	publish	\N
cmp1ifguj000ii3jy1n39899x	cmp1eyavw0000i3ci3gn2iflv	portfolio	manage	\N
cmp1ifguj000ji3jyfcjkt18s	cmp1eyavw0000i3ci3gn2iflv	colors	read	\N
cmp1ifguj000ki3jy63cguhi9	cmp1eyavw0000i3ci3gn2iflv	colors	create	\N
cmp1ifguj000li3jyiarawe12	cmp1eyavw0000i3ci3gn2iflv	colors	update	\N
cmp1ifguj000mi3jyapk7u187	cmp1eyavw0000i3ci3gn2iflv	colors	delete	\N
cmp1ifguj000ni3jyiy5wf0b7	cmp1eyavw0000i3ci3gn2iflv	colors	publish	\N
cmp1ifguj000oi3jydyr7c13k	cmp1eyavw0000i3ci3gn2iflv	colors	manage	\N
cmp1ifguj000pi3jy7so9dpiw	cmp1eyavw0000i3ci3gn2iflv	roles	read	\N
cmp1ifguj000qi3jytaz2wueb	cmp1eyavw0000i3ci3gn2iflv	roles	create	\N
cmp1ifguj000ri3jycbukkk0h	cmp1eyavw0000i3ci3gn2iflv	roles	update	\N
cmp1ifguj000si3jyumlzz0t7	cmp1eyavw0000i3ci3gn2iflv	roles	delete	\N
cmp1ifguj000ti3jy6cci901i	cmp1eyavw0000i3ci3gn2iflv	roles	publish	\N
cmp1ifguj000ui3jyu9zixmjk	cmp1eyavw0000i3ci3gn2iflv	roles	manage	\N
cmp1ifguj000vi3jyyn6zqcbx	cmp1eyavw0000i3ci3gn2iflv	users	read	\N
cmp1ifguj000wi3jyiwz9m5v2	cmp1eyavw0000i3ci3gn2iflv	users	create	\N
cmp1ifguj000xi3jy4cdwo6ud	cmp1eyavw0000i3ci3gn2iflv	users	update	\N
cmp1ifguj000yi3jyohunbwgm	cmp1eyavw0000i3ci3gn2iflv	users	delete	\N
cmp1ifguj000zi3jykvohsmbi	cmp1eyavw0000i3ci3gn2iflv	users	publish	\N
cmp1ifguj0010i3jyx05h35ge	cmp1eyavw0000i3ci3gn2iflv	users	manage	\N
cmp1ifguj0011i3jyh3fyfzj8	cmp1eyavw0000i3ci3gn2iflv	settings	read	\N
cmp1ifguj0012i3jyf5ysvtem	cmp1eyavw0000i3ci3gn2iflv	settings	create	\N
cmp1ifguj0013i3jy7sga59l1	cmp1eyavw0000i3ci3gn2iflv	settings	update	\N
cmp1ifguj0014i3jycil345dt	cmp1eyavw0000i3ci3gn2iflv	settings	delete	\N
cmp1ifguj0015i3jyf29jif3j	cmp1eyavw0000i3ci3gn2iflv	settings	publish	\N
cmp1ifguj0016i3jy695jx76p	cmp1eyavw0000i3ci3gn2iflv	settings	manage	\N
cmp1ifguj0017i3jygrtzuikf	cmp1eyavw0000i3ci3gn2iflv	ai	read	\N
cmp1ifguj0018i3jyc0683pgl	cmp1eyavw0000i3ci3gn2iflv	ai	create	\N
cmp1ifguj0019i3jyhtx6m6ii	cmp1eyavw0000i3ci3gn2iflv	ai	update	\N
cmp1ifguj001ai3jyb7dwf7aq	cmp1eyavw0000i3ci3gn2iflv	ai	delete	\N
cmp1ifguj001bi3jy5825h3gk	cmp1eyavw0000i3ci3gn2iflv	ai	publish	\N
cmp1ifguj001ci3jyzs1rbvb5	cmp1eyavw0000i3ci3gn2iflv	ai	manage	\N
cmp1ifguj001di3jykwc2gd73	cmp1eyavw0000i3ci3gn2iflv	media	read	\N
cmp1ifguj001ei3jyd6rqn2e0	cmp1eyavw0000i3ci3gn2iflv	media	create	\N
cmp1ifguj001fi3jyc50t7yyc	cmp1eyavw0000i3ci3gn2iflv	media	update	\N
cmp1ifguj001gi3jyb4aaafgi	cmp1eyavw0000i3ci3gn2iflv	media	delete	\N
cmp1ifguj001hi3jyl9et8i13	cmp1eyavw0000i3ci3gn2iflv	media	publish	\N
cmp1ifguj001ii3jyk6pt60m9	cmp1eyavw0000i3ci3gn2iflv	media	manage	\N
cmp1ifguo001ki3jy07qun89f	cmp1eyaw7001ji3cii4hidvf0	blog	manage	\N
cmp1ifgup001li3jy8ikva5wq	cmp1eyaw7001ji3cii4hidvf0	pages	manage	\N
cmp1ifgup001mi3jyrubqguzk	cmp1eyaw7001ji3cii4hidvf0	portfolio	manage	\N
cmp1ifgup001ni3jy5aaum3ce	cmp1eyaw7001ji3cii4hidvf0	colors	manage	\N
cmp1ifgup001oi3jywq60wwj5	cmp1eyaw7001ji3cii4hidvf0	ai	manage	\N
cmp1ifgup001pi3jy3r0by5od	cmp1eyaw7001ji3cii4hidvf0	media	manage	\N
cmp1ifgup001qi3jycugfa1vb	cmp1eyaw7001ji3cii4hidvf0	users	read	\N
cmp1ifgup001ri3jy8ri46zzt	cmp1eyaw7001ji3cii4hidvf0	settings	read	\N
cmp1ifguq001ti3jyk6jzbdwr	cmp1eyawa001si3ci3ljbbvyt	blog	read	\N
cmp1ifguq001ui3jym1vxfsw5	cmp1eyawa001si3ci3ljbbvyt	blog	create	\N
cmp1ifguq001vi3jy82o9yzl9	cmp1eyawa001si3ci3ljbbvyt	blog	update	\N
cmp1ifguq001wi3jy2syw58dq	cmp1eyawa001si3ci3ljbbvyt	ai	read	\N
cmp1ifguq001xi3jyru50xgpd	cmp1eyawa001si3ci3ljbbvyt	ai	create	\N
cmp1ifguq001yi3jy5hulyysk	cmp1eyawa001si3ci3ljbbvyt	media	create	\N
cmp1ifguq001zi3jympi20m64	cmp1eyawa001si3ci3ljbbvyt	media	read	\N
cmp1ifgus0021i3jyf6rkkbd2	cmp1eyawc0020i3ci1fzv6c18	colors	read	\N
cmp1ifgus0022i3jyof8fd890	cmp1eyawc0020i3ci1fzv6c18	colors	update	\N
cmp1ifgus0023i3jylghuxk4e	cmp1eyawc0020i3ci1fzv6c18	pages	read	\N
cmp1ifgus0024i3jy5a32w8pr	cmp1eyawc0020i3ci1fzv6c18	pages	update	\N
cmp1ifgus0025i3jytkm4bimm	cmp1eyawc0020i3ci1fzv6c18	media	manage	\N
cmp1ifgus0026i3jy3e2a3lhv	cmp1eyawc0020i3ci1fzv6c18	blog	read	\N
cmp1ifgus0027i3jysb3xhrp5	cmp1eyawc0020i3ci1fzv6c18	portfolio	read	\N
cmp1ifgus0028i3jya6nmtrna	cmp1eyawc0020i3ci1fzv6c18	portfolio	update	\N
cmp1ifgut002ai3jyaznjzihm	cmp1eyawe0029i3cijvrsb7do	blog	read	\N
cmp1ifgut002bi3jyf2nffu7f	cmp1eyawe0029i3cijvrsb7do	pages	read	\N
cmp1ifgut002ci3jyn5kwb60x	cmp1eyawe0029i3cijvrsb7do	portfolio	read	\N
\.


--
-- Data for Name: portfolio_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_items (id, title, slug, client, category, description, content, "coverImage", images, tags, results, year, "isPublished", "order", "createdAt", "updatedAt") FROM stdin;
cmp1eyb4s002ii3cindtbhps2	Zara Home — Social Media Kampanyası	zara-home-social-media	Zara Home	Marketing	Aylık %340 engagement artışı sağlayan multi-platform sosyal medya stratejisi.	\N	https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800	{}	{"social media",instagram,tiktok}	[{"value": "+340%", "metric": "Engagement Artışı"}, {"value": "85K", "metric": "Yeni Takipçi"}, {"value": "4.2x", "metric": "ROAS"}]	2024	t	1	2026-05-11 16:25:50.044	2026-05-11 16:25:50.044
cmp1eyb4u002ji3ci3woltdp2	StartupX — Marka Kimliği & Launch	startupx-marka-kimligi	StartupX	Branding	Sıfırdan marka inşası: logo, kimlik, launch kampanyası ve dijital varlık.	\N	https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800	{}	{branding,logo,launch}	[{"value": "500K₺", "metric": "Launch Günü Satış"}, {"value": "23 Yayın", "metric": "Medya Coverage"}]	2024	t	2	2026-05-11 16:25:50.047	2026-05-11 16:25:50.047
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, "isSystem", "createdAt", "updatedAt") FROM stdin;
cmp1eyavw0000i3ci3gn2iflv	Super Admin	Tüm sisteme tam erişim — sadece kurucu	t	2026-05-11 16:25:49.724	2026-05-11 18:03:09.446
cmp1eyaw7001ji3cii4hidvf0	Admin	Kullanıcı ve rol yönetimi hariç tam erişim	t	2026-05-11 16:25:49.736	2026-05-11 18:03:09.455
cmp1eyawa001si3ci3ljbbvyt	Editor	Blog ve içerik oluşturma/düzenleme	f	2026-05-11 16:25:49.738	2026-05-11 18:03:09.458
cmp1eyawc0020i3ci1fzv6c18	Graphic Designer	Renk, tema ve görsel düzenleme	f	2026-05-11 16:25:49.74	2026-05-11 18:03:09.46
cmp1eyawe0029i3cijvrsb7do	Viewer	Sadece görüntüleme yetkisi	f	2026-05-11 16:25:49.742	2026-05-11 18:03:09.461
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, key, value, type, "updatedAt") FROM stdin;
cmp1eyb4y002mi3cieidokt4b	site_name	FlixFlex	string	2026-05-11 16:25:50.051
cmp1eyb4z002ni3cil1ns09eu	site_tagline	Next-Gen Reklam Ajansı	string	2026-05-11 16:25:50.052
cmp1eyb50002oi3cign5yooxx	site_email	merhaba@flixflex.com	string	2026-05-11 16:25:50.053
cmp1eyb51002pi3cifoom2xum	site_phone	+90 212 000 00 00	string	2026-05-11 16:25:50.053
cmp1eyb52002qi3cilcyz064p	social_instagram	https://instagram.com/flixflex	string	2026-05-11 16:25:50.055
cmp1eyb53002ri3cijzby76va	social_linkedin	https://linkedin.com/company/flixflex	string	2026-05-11 16:25:50.056
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password, image, "isActive", "lastLogin", "roleId", "createdAt", "updatedAt") FROM stdin;
cmp1eyb4e002ei3ci80keweaq	admin@flixflex.com	FlixFlex Admin	$2b$12$aCSK.P6WktCynIeIoB0ZneN8utdgM5RwZ.COvdRHjhMRAnaltopXS	\N	t	2026-05-11 17:08:06.765	cmp1eyavw0000i3ci3gn2iflv	2026-05-11 16:25:50.03	2026-05-11 18:03:09.804
cmp1jcg4f0002i3aec1okdxoz	omerustagul@flixflex.com	Ömer Baran Ustagül	$2b$12$0lo09MaPqTAtyAbpKmlsj.OJfE/2TE2beR/N/QU.ClIiCRjRFmdku	\N	t	2026-05-11 19:16:36.369	cmp1eyawc0020i3ci1fzv6c18	2026-05-11 18:28:48.16	2026-05-11 19:16:36.37
\.


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: color_palettes color_palettes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color_palettes
    ADD CONSTRAINT color_palettes_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: custom_fonts custom_fonts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_fonts
    ADD CONSTRAINT custom_fonts_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: page_versions page_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_versions
    ADD CONSTRAINT page_versions_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: portfolio_items portfolio_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT portfolio_items_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: blog_posts_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug);


--
-- Name: custom_fonts_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX custom_fonts_name_key ON public.custom_fonts USING btree (name);


--
-- Name: media_muxAssetId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "media_muxAssetId_key" ON public.media USING btree ("muxAssetId");


--
-- Name: media_muxPlaybackId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "media_muxPlaybackId_key" ON public.media USING btree ("muxPlaybackId");


--
-- Name: media_muxUploadId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "media_muxUploadId_key" ON public.media USING btree ("muxUploadId");


--
-- Name: pages_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pages_slug_key ON public.pages USING btree (slug);


--
-- Name: permissions_roleId_resource_action_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "permissions_roleId_resource_action_key" ON public.permissions USING btree ("roleId", resource, action);


--
-- Name: portfolio_items_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX portfolio_items_slug_key ON public.portfolio_items USING btree (slug);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: site_settings_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX site_settings_key_key ON public.site_settings USING btree (key);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: audit_logs audit_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: page_versions page_versions_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_versions
    ADD CONSTRAINT "page_versions_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public.pages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permissions permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 8vABI8ZOwU2EDY1FHy52YU3wDTvEEbMURSL9BARTcehfmqzES99f9g1Kg1aJbNt

