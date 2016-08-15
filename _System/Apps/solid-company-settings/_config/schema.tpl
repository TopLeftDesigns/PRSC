<span itemscope itemtype="http://schema.org/{{this.type}}">
<meta itemprop="name" content="{{this.name}}">
<meta itemprop="logo" content="{{this.logo}}">
<meta itemprop="url" content="{{this.domain}}">
<meta itemprop="telephone" content="{{this.phone}}">
<meta itemprop="faxNumber" content="{{this.fax}}">
<meta itemprop="email" content="{{this.email}}">
<span itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
<meta itemprop="streetAddress" content="{{this.address}} {{this.address2}}">
<meta itemprop="addressLocality" content="{{this.city}}">
<meta itemprop="addressRegion" content="{{this.state}}">
<meta itemprop="addressCountry" content="{{this.country}}">
<meta itemprop="postalCode" content="{{this.zip}}">
<meta itemprop="telephone" content="{{this.phone}}">
<meta itemprop="faxNumber" content="{{this.fax}}"></span>
{% if this.location2-address != '' -%}
<span itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
<meta itemprop="streetAddress" content="{{this.location2-address}} {{this.location2-address2}}">
<meta itemprop="addressLocality" content="{{this.location2-city}}">
<meta itemprop="addressRegion" content="{{this.location2-state}}">
<meta itemprop="addressCountry" content="{{this.location2-country}}">
<meta itemprop="postalCode" content="{{this.location2-zip}}">
<meta itemprop="telephone" content="{{this.location2-phone}}">
<meta itemprop="faxNumber" content="{{this.location2-fax}}"></span>
{% endif -%}
</span>