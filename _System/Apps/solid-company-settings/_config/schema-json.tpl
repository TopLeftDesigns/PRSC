<script type="application/ld+json">
{
	"@context": "http://schema.org",
	"@type": "{{this.type}}",
	"name": "{{this.name}}",
	{% if this.slogan != '' -%}"description": "{{this.slogan}}",{% endif -%}
	{% if this.email != '' -%}"email": "{{this.email}}",{% endif -%}
	{% if this.phone != '' -%}"telephone": "{{this.phone}}",{% endif -%}
	{% if this.fax != '' -%}"faxNumber": "{{this.fax}}",{% endif -%}
	{% if this.domain != '' -%}"url": "{{this.Domain}}",{% endif -%}
	{% if this.logo != '' -%}"logo": "{{this.logo}}",{% endif -%}
	"address":
	[
	{
		"@type": "PostalAddress",
		"streetAddress": "{{this.address}} {{this.address2}}",
		"addressLocality": "{{this.city}}",
		"addressRegion": "{{this.state}}",
		"postalCode": "{{this.zip}}",
		"addressCountry": "{{this.country}}",
		"telephone": "{{this.phone}}",
		"faxNumber": "{{this.fax}}"
	}{% if this.location2-address != '' -%},
	{
		"@type": "PostalAddress",
		"streetAddress": "{{this.location2-address}} {{this.location2-address2}}",
		"addressLocality": "{{this.location2-city}}",
		"addressRegion": "{{this.location2-state}}",
		"postalCode": "{{this.location2-zip}}",
		"addressCountry": "{{this.location2-country}}",
		"telephone": "{{this.location2-phone}}",
		"faxNumber": "{{this.location2-fax}}"
	}
	{% endif -%}
	]
}
</script>